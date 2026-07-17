import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/constants";
import { getUserCollectionsAction } from "@/actions/collection.actions";
import ShareCollectionForm from "@/components/dashboard/ShareCollectionForm";
import CollectionList from "@/components/dashboard/CollectionList";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Bagikan Portofolio",
  description:
    "Buat satu link berisi beberapa karya pilihan untuk dibagikan ke HRD atau recruiter.",
};

export default async function ShareCollectionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  const { data: publishedItems } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const collectionsRes = await getUserCollectionsAction();
  const collections = collectionsRes.success && collectionsRes.data ? collectionsRes.data : [];

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-3xl mx-auto w-full">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bagikan Portofolio</h1>
          <p className="text-muted-foreground">
            Pilih beberapa karya sekaligus, buat satu link, lalu kirim ke HRD
            atau recruiter saat melamar magang atau pekerjaan. Mereka bisa
            langsung melihat semua karya pilihanmu tanpa perlu login.
          </p>
        </div>

        <ShareCollectionForm publishedItems={publishedItems || []} />

        <Separator />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Link yang Pernah Dibuat
          </h2>
          <CollectionList collections={collections} />
        </div>
      </div>
    </main>
  );
}
