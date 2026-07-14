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
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Lengkapi Profil Anda
          </h1>
          <p className="text-muted-foreground">
            Tambahkan informasi profil untuk melengkapi akun Gradfolio Anda.
          </p>
        </div>
        
        <div className="bg-card border border-border/50 text-card-foreground rounded-xl shadow-sm p-6 sm:p-8">
          <ProfileForm initialData={profile} mode="onboarding" />
        </div>
      </div>
    </main>
  );
}
