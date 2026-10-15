"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import type { CategoryItem } from "@/types";

type NavLink = { name: string; slug: string };

export function AppShell({
  children,
  industries,
  materials,
  footerCategories,
}: {
  children: React.ReactNode;
  industries: NavLink[];
  materials: NavLink[];
  footerCategories: CategoryItem[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Header industries={industries} materials={materials} />
      <main className="flex-1">{children}</main>
      <Footer categories={footerCategories} />
    </CartProvider>
  );
}
