// =============================================================================
// Gradfolio — Portfolio Server Actions
// =============================================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { portfolioSchema } from "@/schemas/portfolio.schema";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import type {
  ActionResponse,
  PortfolioItem,
  PortfolioItemUpdate,
  PortfolioItemWithResources,
  PortfolioItemFull,
} from "@/types/portfolio.types";

/**
 * Create a new portfolio item with resources.
 */
export async function createPortfolioAction(
  formData: FormData
): Promise<ActionResponse<{ id: string }>> {
  const rawData = {
    title: formData.get("title") as string,
    category: formData.get("category") as string,
    jenis_portfolio: formData.get("jenis_portfolio") as string,
    semester: formData.get("semester")
      ? Number(formData.get("semester"))
      : null,
    tahun_pengerjaan: Number(formData.get("tahun_pengerjaan")),
    deskripsi_singkat: formData.get("deskripsi_singkat") as string,
    deskripsi_lengkap: formData.get("deskripsi_lengkap") as string,
    peran: (formData.get("peran") as string) || null,
    status: (formData.get("status") as "draft" | "published") || "draft",
    tech_stack: JSON.parse((formData.get("tech_stack") as string) || "[]"),
    resources: JSON.parse((formData.get("resources") as string) || "[]"),
  };

  // Validate input
  const validationResult = portfolioSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      message: "Data tidak valid",
      errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { resources, ...portfolioData } = validationResult.data;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    // Get cover image data from formData
    const coverImageUrl = formData.get("cover_image_url") as string | null;
    const coverImagePublicId = formData.get("cover_image_public_id") as string | null;

    // Insert portfolio item
    const { data: portfolioItem, error: portfolioError } = await supabase
      .from("portfolio_items")
      .insert({
        ...portfolioData,
        user_id: user.id,
        cover_image_url: coverImageUrl,
        cover_image_public_id: coverImagePublicId,
      })
      .select("id")
      .single();

    if (portfolioError || !portfolioItem) {
      console.error("Portfolio create error:", portfolioError);
      return {
        success: false,
        message: "Gagal membuat portfolio item. Silakan coba lagi.",
      };
    }

    // Insert resources if any
    if (resources.length > 0) {
      const resourcesData = resources.map((resource) => ({
        portfolio_item_id: portfolioItem.id,
        resource_type: resource.resource_type,
        label: resource.label,
        url: resource.url,
      }));

      const { error: resourceError } = await supabase
        .from("portfolio_resources")
        .insert(resourcesData);

      if (resourceError) {
        console.error("Resources create error:", resourceError);
        // Non-critical — portfolio was created, resources can be added later
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      message: "Portfolio item berhasil dibuat.",
      data: { id: portfolioItem.id },
    };
  } catch (error) {
    console.error("Create portfolio action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Update an existing portfolio item.
 */
export async function updatePortfolioAction(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    title: formData.get("title") as string,
    category: formData.get("category") as string,
    jenis_portfolio: formData.get("jenis_portfolio") as string,
    semester: formData.get("semester")
      ? Number(formData.get("semester"))
      : null,
    tahun_pengerjaan: Number(formData.get("tahun_pengerjaan")),
    deskripsi_singkat: formData.get("deskripsi_singkat") as string,
    deskripsi_lengkap: formData.get("deskripsi_lengkap") as string,
    peran: (formData.get("peran") as string) || null,
    status: (formData.get("status") as "draft" | "published") || "draft",
    tech_stack: JSON.parse((formData.get("tech_stack") as string) || "[]"),
    resources: JSON.parse((formData.get("resources") as string) || "[]"),
  };

  // Validate input
  const validationResult = portfolioSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      message: "Data tidak valid",
      errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { resources, ...portfolioData } = validationResult.data;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from("portfolio_items")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!existing || existing.user_id !== user.id) {
      return {
        success: false,
        message: "Anda tidak memiliki akses ke portfolio item ini.",
      };
    }

    // Get cover image data from formData
    const coverImageUrl = formData.get("cover_image_url") as string | null;
    const coverImagePublicId = formData.get("cover_image_public_id") as string | null;

    // Update portfolio item
    const updatePayload: PortfolioItemUpdate = {
      ...portfolioData,
      updated_at: new Date().toISOString(),
    };

    if (coverImageUrl !== null) {
      updatePayload.cover_image_url = coverImageUrl;
      updatePayload.cover_image_public_id = coverImagePublicId;
    }

    const { error: updateError } = await supabase
      .from("portfolio_items")
      .update(updatePayload)
      .eq("id", id);

    if (updateError) {
      console.error("Portfolio update error:", updateError);
      return {
        success: false,
        message: "Gagal memperbarui portfolio item. Silakan coba lagi.",
      };
    }

    // Replace resources: delete existing, insert new
    const { error: deleteResourcesError } = await supabase
      .from("portfolio_resources")
      .delete()
      .eq("portfolio_item_id", id);

    if (deleteResourcesError) {
      console.error("Delete resources error:", deleteResourcesError);
    }

    if (resources.length > 0) {
      const resourcesData = resources.map((resource) => ({
        portfolio_item_id: id,
        resource_type: resource.resource_type,
        label: resource.label,
        url: resource.url,
      }));

      const { error: insertResourcesError } = await supabase
        .from("portfolio_resources")
        .insert(resourcesData);

      if (insertResourcesError) {
        console.error("Insert resources error:", insertResourcesError);
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/");
    revalidatePath(`/portfolio/${id}`);

    return {
      success: true,
      message: "Portfolio item berhasil diperbarui.",
    };
  } catch (error) {
    console.error("Update portfolio action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Delete a portfolio item and its resources.
 */
export async function deletePortfolioAction(
  id: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    // Get portfolio item with cover info for Cloudinary cleanup
    const { data: item } = await supabase
      .from("portfolio_items")
      .select("user_id, cover_image_public_id")
      .eq("id", id)
      .single();

    if (!item || item.user_id !== user.id) {
      return {
        success: false,
        message: "Anda tidak memiliki akses ke portfolio item ini.",
      };
    }

    // Delete cover from Cloudinary
    if (item.cover_image_public_id) {
      await deleteFromCloudinary(item.cover_image_public_id);
    }

    // Delete portfolio item (resources cascade via DB)
    const { error } = await supabase
      .from("portfolio_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Portfolio delete error:", error);
      return {
        success: false,
        message: "Gagal menghapus portfolio item. Silakan coba lagi.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      message: "Portfolio item berhasil dihapus.",
    };
  } catch (error) {
    console.error("Delete portfolio action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Publish a portfolio item.
 */
export async function publishPortfolioAction(
  id: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const { error } = await supabase
      .from("portfolio_items")
      .update({ status: "published", updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Publish error:", error);
      return {
        success: false,
        message: "Gagal mempublikasikan portfolio item.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      message: "Portfolio item berhasil dipublikasikan.",
    };
  } catch (error) {
    console.error("Publish portfolio action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Unpublish a portfolio item (set to draft).
 */
export async function unpublishPortfolioAction(
  id: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const { error } = await supabase
      .from("portfolio_items")
      .update({ status: "draft", updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Unpublish error:", error);
      return {
        success: false,
        message: "Gagal mengubah status portfolio item ke draft.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      message: "Portfolio item berhasil diubah ke draft.",
    };
  } catch (error) {
    console.error("Unpublish portfolio action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Get all portfolio items for the current user (dashboard).
 */
export async function getUserPortfoliosAction(): Promise<
  ActionResponse<PortfolioItem[]>
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Get user portfolios error:", error);
      return {
        success: false,
        message: "Gagal mengambil data portfolio.",
      };
    }

    return {
      success: true,
      message: "Data portfolio berhasil diambil.",
      data: data || [],
    };
  } catch (error) {
    console.error("Get user portfolios action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Get a single portfolio item with resources (for edit form).
 */
export async function getPortfolioWithResourcesAction(
  id: string
): Promise<ActionResponse<PortfolioItemWithResources>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*, resources:portfolio_resources(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return {
        success: false,
        message: "Portfolio item tidak ditemukan.",
      };
    }

    return {
      success: true,
      message: "Data portfolio berhasil diambil.",
      data,
    };
  } catch (error) {
    console.error("Get portfolio with resources action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Get a published portfolio item with full details (public share page).
 */
export async function getPublicPortfolioAction(
  id: string
): Promise<ActionResponse<PortfolioItemFull>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("portfolio_items")
      .select(
        "*, resources:portfolio_resources(*), profiles(id, full_name, avatar_url, institution, program_studi, angkatan, bio)"
      )
      .eq("id", id)
      .eq("status", "published")
      .single();

    if (error || !data) {
      return {
        success: false,
        message: "Portfolio item tidak ditemukan.",
      };
    }

    return {
      success: true,
      message: "Data portfolio berhasil diambil.",
      data: data as unknown as PortfolioItemFull,
    };
  } catch (error) {
    console.error("Get public portfolio action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Get all published portfolio items (for public showcase page).
 * Supports optional search and category filters.
 */
export async function getAllPublicPortfoliosAction({
  search,
  category,
}: {
  search?: string;
  category?: string;
} = {}): Promise<ActionResponse<any[]>> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("portfolio_items")
      .select(
        "*, profiles(id, full_name, avatar_url, institution, program_studi, angkatan, bio)"
      )
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }
    
    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get all public portfolios error:", error);
      return {
        success: false,
        message: "Gagal mengambil data portfolio publik.",
      };
    }

    return {
      success: true,
      message: "Data portfolio publik berhasil diambil.",
      data: data || [],
    };
  } catch (error) {
    console.error("Get all public portfolios action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}
