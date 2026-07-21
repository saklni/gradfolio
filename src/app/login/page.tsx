import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke akun Gradfolio Anda.",
};

export default function LoginPage() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-grid-fade px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 h-[380px] w-[380px] -translate-x-[80%] rounded-full bg-primary/15 blur-3xl animate-blob" />
        <div className="absolute top-1/3 left-1/2 h-[320px] w-[320px] translate-x-[20%] rounded-full bg-[oklch(0.72_0.145_220)]/15 blur-3xl animate-blob [animation-delay:3s]" />
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

        <LoginForm />
      </div>
    </main>
  );
}
