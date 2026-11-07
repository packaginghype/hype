"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FooterQuoteCta } from "@/components/layout/FooterQuoteCta";
import { CartProvider } from "@/components/cart/CartProvider";
import type {
  FooterLegalLink,
  FooterMenuColumn,
} from "@/lib/general-settings-schema";
import type { CategoryItem } from "@/types";

type NavLink = { name: string; slug: string };
type MenuPageLink = { label: string; href: string; slug: string };

export function AppShell({
  children,
  categories,
  industries,
  materials,
  footerCategories,
  headerPages = [],
  footerPages = [],
  logoUrl,
  logoAlt,
  footerColumns,
  footerLegalLinks,
}: {
  children: React.ReactNode;
  categories: NavLink[];
  industries: NavLink[];
  materials: NavLink[];
  footerCategories: CategoryItem[];
  headerPages?: MenuPageLink[];
  footerPages?: MenuPageLink[];
  logoUrl?: string;
  logoAlt?: string;
  footerColumns?: FooterMenuColumn[];
  footerLegalLinks?: FooterLegalLink[];
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
        customPages={headerPages}
        logoUrl={logoUrl}
        logoAlt={logoAlt}
      />
      <main className="flex-1 min-h-[70vh]">{children}</main>
      {!hideQuoteCta ? <FooterQuoteCta /> : null}
      <Footer
        categories={footerCategories}
        customPages={footerPages}
        logoUrl={logoUrl}
        logoAlt={logoAlt}
        footerColumns={footerColumns}
        footerLegalLinks={footerLegalLinks}
      />
    </CartProvider>
  );
}
