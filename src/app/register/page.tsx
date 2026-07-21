import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Registrasi",
  description: "Buat akun Gradfolio baru untuk mulai membangun portfolio.",
};

export default function RegisterPage() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-grid-fade px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-24 right-1/2 h-[380px] w-[380px] translate-x-[80%] rounded-full bg-primary/15 blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/2 h-[320px] w-[320px] -translate-x-[20%] rounded-full bg-[oklch(0.58_0.25_296)]/15 blur-3xl animate-blob [animation-delay:3s]" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up space-y-8">
        <Link href={ROUTES.HOME} className="flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow-glow-primary">
            <GraduationCap className="h-5.5 w-5.5 text-white" />
          </span>
          <span className="font-heading text-2xl font-bold tracking-tight">
            Grad<span className="text-gradient-brand">folio</span>
          </span>
        </Link>

        <RegisterForm />
      </div>
    </main>
  );
}
