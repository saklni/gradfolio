// =============================================================================
// Gradfolio — Resource Server Actions
// =============================================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { resourceSchema } from "@/schemas/portfolio.schema";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types/portfolio.types";

/**
 * Add one or more resources to a portfolio item.
 */
export async function addResourceAction(
  portfolioItemId: string,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    resource_type: formData.get("resource_type") as string,
    label: formData.get("label") as string,
    url: formData.get("url") as string,
  };

  const validationResult = resourceSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      message: "Data tidak valid",
      errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    // Verify ownership of the portfolio item
    const { data: item } = await supabase
      .from("portfolio_items")
      .select("user_id")
      .eq("id", portfolioItemId)
      .single();

    if (!item || item.user_id !== user.id) {
      return {
        success: false,
        message: "Anda tidak memiliki akses ke portfolio item ini.",
      };
    }

    const { error } = await supabase.from("portfolio_resources").insert({
      portfolio_item_id: portfolioItemId,
      ...validationResult.data,
    });

    if (error) {
      console.error("Add resource error:", error);
      return {
        success: false,
        message: "Gagal menambahkan resource. Silakan coba lagi.",
      };
    }

    revalidatePath(`/portfolio/${portfolioItemId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Resource berhasil ditambahkan.",
    };
  } catch (error) {
    console.error("Add resource action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Update a single resource.
 */
export async function updateResourceAction(
  resourceId: string,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    resource_type: formData.get("resource_type") as string,
    label: formData.get("label") as string,
    url: formData.get("url") as string,
  };

  const validationResult = resourceSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      message: "Data tidak valid",
      errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    // Get resource with portfolio item to verify ownership
    const { data: resource } = await supabase
      .from("portfolio_resources")
      .select("portfolio_item_id")
      .eq("id", resourceId)
      .single();

    if (!resource) {
      return { success: false, message: "Resource tidak ditemukan." };
    }

    const { data: item } = await supabase
      .from("portfolio_items")
      .select("user_id")
      .eq("id", resource.portfolio_item_id)
      .single();

    if (!item || item.user_id !== user.id) {
      return {
        success: false,
        message: "Anda tidak memiliki akses ke resource ini.",
      };
    }

    const { error } = await supabase
      .from("portfolio_resources")
      .update(validationResult.data)
      .eq("id", resourceId);

    if (error) {
      console.error("Update resource error:", error);
      return {
        success: false,
        message: "Gagal memperbarui resource. Silakan coba lagi.",
      };
    }

    revalidatePath(`/portfolio/${resource.portfolio_item_id}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Resource berhasil diperbarui.",
    };
  } catch (error) {
    console.error("Update resource action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Delete a single resource.
 */
export async function deleteResourceAction(
  resourceId: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    // Get resource with portfolio item to verify ownership
    const { data: resource } = await supabase
      .from("portfolio_resources")
      .select("portfolio_item_id")
      .eq("id", resourceId)
      .single();

    if (!resource) {
      return { success: false, message: "Resource tidak ditemukan." };
    }

    const { data: item } = await supabase
      .from("portfolio_items")
      .select("user_id")
      .eq("id", resource.portfolio_item_id)
      .single();

    if (!item || item.user_id !== user.id) {
      return {
        success: false,
        message: "Anda tidak memiliki akses ke resource ini.",
      };
    }

    const { error } = await supabase
      .from("portfolio_resources")
      .delete()
      .eq("id", resourceId);

    if (error) {
      console.error("Delete resource error:", error);
      return {
        success: false,
        message: "Gagal menghapus resource. Silakan coba lagi.",
      };
    }

    revalidatePath(`/portfolio/${resource.portfolio_item_id}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Resource berhasil dihapus.",
    };
  } catch (error) {
    console.error("Delete resource action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}
