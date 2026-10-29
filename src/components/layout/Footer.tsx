import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { VERIFIED_BUSINESS_INFO } from "@/data/verified-data";
import type { CategoryItem } from "@/types";

const SHOP_LINKS = [
  { label: "Industries", href: "/industries" },
  { label: "Box by Material", href: "/box-by-material" },
  { label: "Shapes & Styles", href: "/shapes-styles" },
  { label: "All Products", href: "/products" },
  { label: "All Categories", href: "/categories" },
] as const;

const COMPANY_LINKS = [
  { label: "About Us", href: "/about-us" },
  { label: "Blog & Guides", href: "/blog" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Get a Quote", href: "/quote" },
  { label: "Cart", href: "/cart" },
] as const;

const LEGAL_LINKS = [
  { label: "Terms", href: "/terms-and-conditions" },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Shipping", href: "/shipping-delivery-policy" },
  { label: "Returns", href: "/refund-return-policy" },
] as const;

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[13.5px] text-[#2F3A4F]/75 transition-colors hover:text-[#FF5548]"
    >
      {children}
    </Link>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#172455]">
      {children}
    </p>
  );
}

export function Footer({ categories }: { categories: CategoryItem[] }) {
  const currentYear = new Date().getFullYear();
  const popular = categories.slice(0, 7);

  return (
    <footer className="relative overflow-hidden text-[#172455]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_20%,rgba(255,255,255,0.55),transparent_55%),radial-gradient(ellipse_50%_45%_at_90%_70%,rgba(255,85,72,0.1),transparent_60%),linear-gradient(160deg,#E4F4EB_0%,#D8EDE3_45%,#C9E4D4_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/3 h-[360px] w-[360px] rounded-full bg-[#FF5548]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-white/45 blur-2xl"
      />

      <Container className="relative py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-0">
          {/* Brand + CTA */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Packaging Hype"
                width={180}
                height={56}
                className="h-10 w-auto sm:h-11"
              />
            </Link>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-[#2F3A4F]/80">
              Custom packaging boxes built for protection, shelf presence, and
              unboxing — from kraft and corrugated to rigid and specialty packs.
            </p>

            <div className="mt-5 space-y-2.5">
              <a
                href={`tel:${VERIFIED_BUSINESS_INFO.phoneRaw}`}
                className="flex items-center gap-2.5 text-[13.5px] font-semibold text-[#172455] transition-colors hover:text-[#FF5548]"
              >
                <Phone className="h-4 w-4 shrink-0 text-[#21AAA5]" aria-hidden />
                {VERIFIED_BUSINESS_INFO.phone}
              </a>
              <a
                href={`mailto:${VERIFIED_BUSINESS_INFO.email}`}
                className="flex items-center gap-2.5 text-[13.5px] text-[#2F3A4F]/80 transition-colors hover:text-[#172455]"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#21AAA5]" aria-hidden />
                {VERIFIED_BUSINESS_INFO.email}
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <FooterHeading>Shop</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular categories */}
          <div>
            <FooterHeading>Popular Categories</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              {popular.length > 0 ? (
                popular.map((cat) => (
                  <li key={cat.id}>
                    <FooterLink href={`/category/${cat.slug}`}>
                      {cat.name}
                    </FooterLink>
                  </li>
                ))
              ) : (
                <li className="text-[13px] text-[#2F3A4F]/60">
                  No categories added yet
                </li>
              )}
              {categories.length > popular.length ? (
                <li>
                  <Link
                    href="/categories"
                    className="text-[13.5px] font-semibold text-[#21AAA5] transition-colors hover:text-[#FF5548]"
                  >
                    View all categories
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>

          {/* Company */}
          <div>
            <FooterHeading>Company</FooterHeading>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="relative border-t border-[#B9D6C6]/70 bg-white/30">
        <Container className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-[12px] text-[#4B5568] sm:text-left">
            © {currentYear} {VERIFIED_BUSINESS_INFO.name}. All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:justify-end">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-[#4B5568] transition-colors hover:text-[#FF5548]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>
    </footer>
  );
}
