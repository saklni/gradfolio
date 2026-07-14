import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Registrasi",
  description: "Buat akun Gradfolio baru untuk mulai membangun portfolio.",
};

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <RegisterForm />
      </div>
    </main>
  );
}
