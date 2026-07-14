// =============================================================================
// Gradfolio — Profile Server Actions
// =============================================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { profileSchema, onboardingSchema } from "@/schemas/profile.schema";
import type { ActionResponse, Profile } from "@/types/portfolio.types";

/**
 * Update user profile.
 */
export async function updateProfileAction(
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    full_name: formData.get("full_name") as string,
    institution: (formData.get("institution") as string) || null,
    program_studi: (formData.get("program_studi") as string) || null,
    angkatan: formData.get("angkatan")
      ? Number(formData.get("angkatan"))
      : null,
    bio: (formData.get("bio") as string) || null,
  };

  // Validate input
  const validationResult = profileSchema.safeParse(rawData);
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

    const { error } = await supabase
      .from("profiles")
      .update({
        ...validationResult.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Profile update error:", error);
      return {
        success: false,
        message: "Gagal memperbarui profil. Silakan coba lagi.",
      };
    }

    return {
      success: true,
      message: "Profil berhasil diperbarui.",
    };
  } catch (error) {
    console.error("Update profile action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Complete onboarding — update profile with required fields.
 */
export async function completeOnboardingAction(
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    full_name: formData.get("full_name") as string,
    institution: formData.get("institution") as string,
    program_studi: formData.get("program_studi") as string,
    angkatan: formData.get("angkatan")
      ? Number(formData.get("angkatan"))
      : null,
    bio: (formData.get("bio") as string) || null,
  };

  // Validate with stricter onboarding schema
  const validationResult = onboardingSchema.safeParse(rawData);
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

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        ...validationResult.data,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Onboarding error:", error);
      return {
        success: false,
        message: "Gagal menyimpan profil. Silakan coba lagi.",
      };
    }

    return {
      success: true,
      message: "Profil berhasil dilengkapi.",
    };
  } catch (error) {
    console.error("Complete onboarding action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Get the current user's profile.
 */
export async function getProfileAction(): Promise<ActionResponse<Profile>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Get profile error:", error);
      return {
        success: false,
        message: "Gagal mengambil data profil.",
      };
    }

    return {
      success: true,
      message: "Profil berhasil diambil.",
      data,
    };
  } catch (error) {
    console.error("Get profile action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}
