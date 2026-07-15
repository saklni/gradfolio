import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/constants";
import ProfileForm from "@/components/profile/ProfileForm";

export const metadata: Metadata = {
  title: "Pengaturan Profil",
  description: "Ubah informasi profil Anda.",
};

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-3xl mx-auto w-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Pengaturan Profil
          </h1>
          <p className="text-muted-foreground">
            Ubah informasi profil dan data diri Anda. Perubahan ini akan
            tampil di setiap Portfolio Item yang Anda publikasikan.
          </p>
        </div>

        <div className="bg-card border border-border/50 text-card-foreground rounded-xl shadow-sm p-6 sm:p-8">
          <ProfileForm initialData={profile} mode="settings" />
        </div>
      </div>
    </main>
  );
}
