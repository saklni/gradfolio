// =============================================================================
// Gradfolio — Auth Server Actions
// =============================================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import type { ActionResponse } from "@/types/portfolio.types";

/**
 * Register a new user account.
 *
 * IMPORTANT: If email confirmation is disabled on the Supabase project,
 * `auth.signUp` already returns an active `session` and the SSR client
 * (called from a Server Action, so it CAN write cookies) sets the session
 * cookie right away — the user is technically already logged in. We surface
 * that via `data.autoLoggedIn` so the client can skip the login page and
 * send the user straight to onboarding. If email confirmation IS required,
 * `session` will be null and the user must verify their email before they
 * can log in — in that case we fall back to the old "check your email" flow.
 */
export async function registerAction(
  formData: FormData
): Promise<ActionResponse<{ autoLoggedIn: boolean }>> {
  const rawData = {
    full_name: formData.get("full_name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Validate input
  const validationResult = registerSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      message: "Data tidak valid",
      errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { full_name, email, password } = validationResult.data;

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message === "User already registered"
          ? "Email sudah terdaftar. Silakan login."
          : `Gagal mendaftar: ${error.message}`,
      };
    }

    if (data.user) {
      // Profile is auto-created by the database trigger (on_auth_user_created).
      // Upsert as a safety net in case the trigger hasn't fired yet.
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          { id: data.user.id, full_name },
          { onConflict: "id" }
        );

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Non-critical — profile will be created by trigger or during onboarding
      }
    }

    // `data.session` is only present when email confirmation is disabled on
    // the Supabase project. When present, the cookies above are already set
    // and the user is fully authenticated — no separate login step needed.
    const autoLoggedIn = !!data.session;

    return {
      success: true,
      message: autoLoggedIn
        ? "Akun berhasil dibuat. Mengarahkan ke pengaturan profil..."
        : "Akun berhasil dibuat. Silakan cek email Anda untuk verifikasi.",
      data: { autoLoggedIn },
    };
  } catch (error) {
    console.error("Register action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Login with email and password.
 */
export async function loginAction(
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validate input
  const validationResult = loginSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      message: "Data tidak valid",
      errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, password } = validationResult.data;

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: "Email atau password salah.",
      };
    }

    return {
      success: true,
      message: "Login berhasil.",
    };
  } catch (error) {
    console.error("Login action error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Logout the current user.
 *
 * IMPORTANT: This does NOT call redirect() here. redirect() throws a special
 * NEXT_REDIRECT signal that Next.js only reliably intercepts when a Server
 * Action is submitted via a <form action={...}>. When a Server Action is
 * instead invoked imperatively from a client event handler (e.g. a dropdown
 * menu "Keluar" button, as in Navbar.tsx), that signal can surface as an
 * unhandled rejection instead of navigating — which looked like "logout
 * tidak berfungsi". The caller is responsible for navigating away (see
 * Navbar's handleLogout, which does a hard `window.location.href` redirect
 * after this resolves, ensuring middleware and all cached user state reset).
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
