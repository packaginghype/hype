import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Phone, Truck, Package, Clock } from "lucide-react";
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

const TRUST_ITEMS = [
  {
    icon: Package,
    label: `MOQ ${VERIFIED_BUSINESS_INFO.moq}`,
  },
  {
    icon: Clock,
    label: VERIFIED_BUSINESS_INFO.turnaround,
  },
  {
    icon: Truck,
    label: VERIFIED_BUSINESS_INFO.shipping,
  },
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
      className="text-[13.5px] text-white/65 transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}

export function Footer({ categories }: { categories: CategoryItem[] }) {
  const currentYear = new Date().getFullYear();
  const popular = categories.slice(0, 7);

  return (
    <footer className="bg-[#172455] text-white">
      {/* Trust strip */}
      <div className="border-b border-white/10 bg-[#132048]">
        <Container className="py-3.5">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-between sm:gap-x-4">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 text-[12.5px] font-medium text-white/80"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-[#21AAA5]" aria-hidden />
                <span>{label}</span>
              </li>
            ))}
            <li className="hidden lg:block">
              <a
                href={`tel:${VERIFIED_BUSINESS_INFO.phoneRaw}`}
                className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-white transition-colors hover:text-[#FF5548]"
              >
                <Phone className="h-3.5 w-3.5 text-[#FF5548]" aria-hidden />
                {VERIFIED_BUSINESS_INFO.phone}
              </a>
            </li>
          </ul>
        </Container>
      </div>

      <Container className="py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand + CTA */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Packaging Hype"
                width={180}
                height={56}
                className="h-10 w-auto sm:h-11"
              />
            </Link>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-white/65">
              Custom packaging boxes built for protection, shelf presence, and
              unboxing — from kraft and corrugated to rigid and specialty packs.
            </p>

            <div className="mt-5 space-y-2.5">
              <a
                href={`tel:${VERIFIED_BUSINESS_INFO.phoneRaw}`}
                className="flex items-center gap-2.5 text-[13.5px] font-semibold text-white transition-colors hover:text-[#FF5548]"
              >
                <Phone className="h-4 w-4 shrink-0 text-[#21AAA5]" aria-hidden />
                {VERIFIED_BUSINESS_INFO.phone}
              </a>
              <a
                href={`mailto:${VERIFIED_BUSINESS_INFO.email}`}
                className="flex items-center gap-2.5 text-[13.5px] text-white/75 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#21AAA5]" aria-hidden />
                {VERIFIED_BUSINESS_INFO.email}
              </a>
            </div>

            <Link
              href="/quote"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-[5px] bg-[#FF5548] px-5 text-[13.5px] font-bold text-white transition-colors hover:bg-[#e04337]"
            >
              Get a Custom Quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          {/* Shop */}
          <div className="lg:col-span-2">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-white">
              Shop
            </h4>
            <ul className="mt-4 space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular categories */}
          <div className="lg:col-span-3">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-white">
              Popular Categories
            </h4>
            <ul className="mt-4 space-y-2.5">
              {popular.map((cat) => (
                <li key={cat.id}>
                  <FooterLink href={`/categories/${cat.slug}`}>
                    {cat.name}
                  </FooterLink>
                </li>
              ))}
              {categories.length > popular.length ? (
                <li>
                  <Link
                    href="/categories"
                    className="text-[13.5px] font-semibold text-[#21AAA5] transition-colors hover:text-white"
                  >
                    View all categories
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-3">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-white">
              Company
            </h4>
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
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-[12px] text-white/45 sm:text-left">
            © {currentYear} {VERIFIED_BUSINESS_INFO.name}. All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:justify-end">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-white/45 transition-colors hover:text-white"
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
