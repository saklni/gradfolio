// =============================================================================
// Gradfolio — Portfolio Collection ("Bagikan Portofolio") Server Actions
// =============================================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { collectionSchema } from "@/schemas/collection.schema";
import { revalidatePath } from "next/cache";
import type {
  ActionResponse,
  PortfolioCollectionSummary,
  PortfolioCollectionWithItems,
} from "@/types/portfolio.types";
import { ROUTES } from "@/constants";

/**
 * Create a new shareable collection (bundle) out of the current user's own
 * PUBLISHED portfolio items. Returns the new collection's id so the client
 * can build the share link (`/share/<id>`).
 */
export async function createCollectionAction(
  formData: FormData
): Promise<ActionResponse<{ id: string }>> {
  const rawData = {
    title: formData.get("title") as string,
    portfolio_item_ids: JSON.parse(
      (formData.get("portfolio_item_ids") as string) || "[]"
    ),
  };

  const validationResult = collectionSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      message: "Data tidak valid",
      errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { title, portfolio_item_ids } = validationResult.data;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Anda harus login untuk membagikan portfolio.",
      };
    }

    // Defensive check (RLS also enforces this): every selected item must
    // belong to this user AND be published, otherwise it's silently
    // dropped from the bundle so we can tell the user exactly what happened
    // instead of a generic RLS insert failure.
    const { data: ownedItems, error: ownedItemsError } = await supabase
      .from("portfolio_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "published")
      .in("id", portfolio_item_ids);

    if (ownedItemsError) {
      console.error("Collection item ownership check error:", ownedItemsError);
      return {
        success: false,
        message: "Gagal memverifikasi karya yang dipilih. Silakan coba lagi.",
      };
    }

    const validItemIds = (ownedItems ?? []).map((item) => item.id);

    if (validItemIds.length === 0) {
      return {
        success: false,
        message:
          "Karya yang dipilih tidak valid. Pastikan karya sudah berstatus Published dan milik Anda.",
      };
    }

    // 1. Create the collection itself.
    const { data: collection, error: collectionError } = await supabase
      .from("portfolio_collections")
      .insert({ user_id: user.id, title })
      .select()
      .single();

    if (collectionError || !collection) {
      console.error("Collection creation error:", collectionError);
      return {
        success: false,
        message: "Gagal membuat link bagikan. Silakan coba lagi.",
      };
    }

    // 2. Link the valid items to it.
    const { error: itemsError } = await supabase.from("collection_items").insert(
      validItemIds.map((portfolio_item_id, index) => ({
        collection_id: collection.id,
        portfolio_item_id,
        position: index,
      }))
    );

    if (itemsError) {
      console.error("Collection items insert error:", itemsError);
      // Roll back the now-empty collection so we don't leave orphaned bundles.
      await supabase.from("portfolio_collections").delete().eq("id", collection.id);
      return {
        success: false,
        message: "Gagal menambahkan karya ke bundle. Silakan coba lagi.",
      };
    }

    revalidatePath(ROUTES.DASHBOARD_SHARE);

    return {
      success: true,
      message:
        validItemIds.length < portfolio_item_ids.length
          ? "Link berhasil dibuat. Beberapa karya yang dipilih dilewati karena belum Published."
          : "Link bagikan berhasil dibuat.",
      data: { id: collection.id },
    };
  } catch (error) {
    console.error("Create collection error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Get all collections (bundles) created by the current user, with item
 * counts, for the "Bagikan Portofolio" management list in the dashboard.
 */
export async function getUserCollectionsAction(): Promise<
  ActionResponse<PortfolioCollectionSummary[]>
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Anda harus login." };
    }

    const { data, error } = await supabase
      .from("portfolio_collections")
      .select("*, collection_items(count)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get collections error:", error);
      return {
        success: false,
        message: "Gagal memuat daftar link bagikan.",
      };
    }

    const collections: PortfolioCollectionSummary[] = (data ?? []).map(
      (row) => {
        const { collection_items, ...rest } = row as typeof row & {
          collection_items: { count: number }[];
        };
        return {
          ...rest,
          item_count: collection_items?.[0]?.count ?? 0,
        };
      }
    );

    return { success: true, message: "OK", data: collections };
  } catch (error) {
    console.error("Get collections error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Delete (revoke) a collection. Cascades to remove its collection_items,
 * immediately invalidating the share link — the portfolio items themselves
 * are untouched.
 */
export async function deleteCollectionAction(
  id: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Anda harus login." };
    }

    const { error } = await supabase
      .from("portfolio_collections")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Delete collection error:", error);
      return {
        success: false,
        message: "Gagal menghapus link bagikan.",
      };
    }

    revalidatePath(ROUTES.DASHBOARD_SHARE);

    return { success: true, message: "Link bagikan berhasil dihapus." };
  } catch (error) {
    console.error("Delete collection error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Public (no-auth) fetch of a collection and its resolved items — powers the
 * `/share/[id]` page that an HRD/recruiter opens.
 */
export async function getPublicCollectionAction(
  id: string
): Promise<ActionResponse<PortfolioCollectionWithItems>> {
  try {
    const supabase = await createClient();

    const { data: collection, error: collectionError } = await supabase
      .from("portfolio_collections")
      .select(
        "*, profiles(id, full_name, avatar_url, institution, program_studi, angkatan)"
      )
      .eq("id", id)
      .single();

    if (collectionError || !collection) {
      return { success: false, message: "Link bagikan tidak ditemukan." };
    }

    const { data: itemRows, error: itemsError } = await supabase
      .from("collection_items")
      .select("position, portfolio_items(*, resources:portfolio_resources(*))")
      .eq("collection_id", id)
      .order("position", { ascending: true });

    if (itemsError) {
      console.error("Get collection items error:", itemsError);
      return { success: false, message: "Gagal memuat isi portfolio." };
    }

    const items = (itemRows ?? [])
      .map((row) => row.portfolio_items)
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return {
      success: true,
      message: "OK",
      data: {
        ...collection,
        items,
      } as unknown as PortfolioCollectionWithItems,
    };
  } catch (error) {
    console.error("Get public collection error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}
