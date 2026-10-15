import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { VERIFIED_BUSINESS_INFO } from "@/data/verified-data";
import type { CategoryItem } from "@/types";

export function Footer({ categories }: { categories: CategoryItem[] }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f1839] text-white pt-16 pb-12 border-t border-white/10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Packaging Hype"
                width={180}
                height={56}
                className="h-11 w-auto rounded-sm"
              />
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Premier manufacturer of custom packaging boxes, folding cartons, corrugated mailers,
              and flexible packaging solutions for forward-thinking retail and e-commerce brands.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#21AAA5]" />
                <a
                  href={`tel:${VERIFIED_BUSINESS_INFO.phoneRaw}`}
                  className="hover:text-white transition-colors font-semibold"
                >
                  {VERIFIED_BUSINESS_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#21AAA5]" />
                <a
                  href={`mailto:${VERIFIED_BUSINESS_INFO.email}`}
                  className="hover:text-white transition-colors"
                >
                  {VERIFIED_BUSINESS_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#21AAA5]" />
                <span>
                  Turnaround: {VERIFIED_BUSINESS_INFO.turnaround} • Free USA Shipping
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Packaging Boxes
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:text-[#FF5548] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="text-[#21AAA5] hover:underline font-semibold"
                >
                  All Categories →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Specialty Packaging
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {categories.slice(6, 12).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:text-[#FF5548] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/about-us" className="hover:text-[#FF5548] transition-colors">
                  About Packaging Hype
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#FF5548] transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#FF5548] transition-colors">
                  Packaging Guides & Blog
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-[#FF5548] transition-colors">
                  Request a Custom Quote
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-[#FF5548] transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {currentYear} {VERIFIED_BUSINESS_INFO.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/shipping-delivery-policy" className="hover:text-white transition-colors">
              Shipping & Delivery
            </Link>
            <Link href="/refund-return-policy" className="hover:text-white transition-colors">
              Refund & Return Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
