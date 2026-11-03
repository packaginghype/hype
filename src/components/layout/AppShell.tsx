"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FooterQuoteCta } from "@/components/layout/FooterQuoteCta";
import { CartProvider } from "@/components/cart/CartProvider";
import type { CategoryItem } from "@/types";

type NavLink = { name: string; slug: string };

export function AppShell({
  children,
  categories,
  industries,
  materials,
  footerCategories,
  logoUrl,
  logoAlt,
}: {
  children: React.ReactNode;
  categories: NavLink[];
  industries: NavLink[];
  materials: NavLink[];
  footerCategories: CategoryItem[];
  logoUrl?: string;
  logoAlt?: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isBlog = pathname?.startsWith("/blog");
  const hideQuoteCta =
    pathname === "/quote" ||
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/admin") ||
    isBlog;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Header
        categories={categories}
        industries={industries}
        materials={materials}
        logoUrl={logoUrl}
        logoAlt={logoAlt}
      />
      <main className="flex-1">{children}</main>
      {!hideQuoteCta ? <FooterQuoteCta /> : null}
      <Footer categories={footerCategories} logoUrl={logoUrl} logoAlt={logoAlt} />
    </CartProvider>
  );
}
