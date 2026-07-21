import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Lengkapi Profil",
  description: "Lengkapi profil Anda untuk mulai menggunakan Gradfolio.",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Get user profile to populate defaults (like full_name from auth registration)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isCompleted = !!(profile?.institution && profile?.program_studi && profile?.angkatan);

  if (isCompleted) {
    redirect(ROUTES.DASHBOARD);
  }

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-grid-fade px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl animate-blob" />
      </div>

      <div className="w-full max-w-3xl animate-fade-in-up space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Lengkapi Profil Anda
          </h1>
          <p className="text-muted-foreground">
            Tambahkan informasi profil untuk melengkapi akun Gradfolio Anda.
          </p>
        </div>

        <div className="bg-card border border-border/50 text-card-foreground rounded-2xl shadow-soft-lg p-6 sm:p-8">
          <ProfileForm initialData={profile} mode="onboarding" />
        </div>
      </div>
    </main>
  );
}
