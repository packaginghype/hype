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
}: {
  children: React.ReactNode;
  categories: NavLink[];
  industries: NavLink[];
  materials: NavLink[];
  footerCategories: CategoryItem[];
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
      />
      <main className="flex-1">{children}</main>
      {!hideQuoteCta ? <FooterQuoteCta /> : null}
      <Footer categories={footerCategories} />
    </CartProvider>
  );
}
