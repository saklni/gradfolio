import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan Profil",
  description: "Ubah informasi profil Anda.",
};

export default function ProfileSettingsPage() {
  return (
    <main className="flex-1 p-6">
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Pengaturan Profil
          </h1>
          <p className="text-muted-foreground">
            Ubah informasi profil dan data diri Anda.
          </p>
        </div>
        {/* ProfileForm will be added in Phase 2 */}
      </div>
    </main>
  );
}
