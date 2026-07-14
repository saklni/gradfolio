// =============================================================================
// Gradfolio — Navbar Component
// =============================================================================

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GraduationCap, Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { logoutAction } from "@/actions/auth.actions";
import { getInitials } from "@/utils";
import { ROUTES } from "@/constants";
import type { Profile } from "@/types/portfolio.types";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser({ id: user.id, email: user.email });

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isDashboard = pathname.startsWith("/dashboard");

  const navLinks = [
    { href: ROUTES.HOME, label: "Showcase" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">
            Grad<span className="text-primary">folio</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === link.href
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-full outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={profile?.avatar_url || undefined}
                      alt={profile?.full_name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {profile?.full_name
                        ? getInitials(profile.full_name)
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">
                      {profile?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push(ROUTES.DASHBOARD)} className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push(ROUTES.DASHBOARD_PROFILE)} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onSelect={async () => {
                    await logoutAction();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href={ROUTES.LOGIN} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Masuk
              </Link>
              <Link href={ROUTES.REGISTER} className={buttonVariants({ size: "sm" })}>
                Daftar
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-6 mt-6">
                {/* Mobile Nav Links */}
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                        pathname === link.href
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth */}
                <div className="border-t pt-4 flex flex-col gap-2">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-3 py-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={profile?.avatar_url || undefined}
                            alt={profile?.full_name || "User"}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {profile?.full_name
                              ? getInitials(profile.full_name)
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">
                            {profile?.full_name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={ROUTES.DASHBOARD}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-md hover:bg-muted"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href={ROUTES.DASHBOARD_PROFILE}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-md hover:bg-muted"
                      >
                        <User className="h-4 w-4" />
                        Profil
                      </Link>
                      <button
                        onClick={async () => {
                          setMobileMenuOpen(false);
                          await logoutAction();
                        }}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-destructive rounded-md hover:bg-destructive/10 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 w-full mt-4">
                      <Link
                        href={ROUTES.LOGIN}
                        onClick={() => setMobileMenuOpen(false)}
                        className={buttonVariants({ variant: "outline", className: "w-full" })}
                      >
                        Masuk
                      </Link>
                      <Link
                        href={ROUTES.REGISTER}
                        onClick={() => setMobileMenuOpen(false)}
                        className={buttonVariants({ className: "w-full" })}
                      >
                        Daftar
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
