"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Phone,
  Mail,
  Menu,
  ChevronDown,
  SendHorizontal,
  Truck,
  Shield,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { useCart } from "@/components/cart/CartProvider";
import { VERIFIED_BUSINESS_INFO } from "@/data/verified-data";
import { cn } from "@/lib/utils";

type NavLink = { name: string; slug: string };
type DropdownKey = "industries" | "materials" | null;

export function Header({
  industries,
  materials,
}: {
  industries: NavLink[];
  materials: NavLink[];
}) {
  const router = useRouter();
  const { itemCount } = useCart();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  function onSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setIsSearchOpen(false);
    router.push(`/products?q=${encodeURIComponent(q)}`);
  }

  const navLinkClass =
    "px-3 py-2 text-sm font-semibold text-[#0B1220] hover:text-[#FF5548] rounded transition-colors";

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      <div className="bg-[#172455] text-white text-xs py-2 hidden md:block border-b border-white/10">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Truck className="w-3.5 h-3.5 text-[#21AAA5]" />
              Free Doorstep Delivery Across USA
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-[#21AAA5]" />
              Low Minimum Order Quantity (MOQ 100)
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={`mailto:${VERIFIED_BUSINESS_INFO.email}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#21AAA5]" />
              <span>{VERIFIED_BUSINESS_INFO.email}</span>
            </a>
            <a
              href={`tel:${VERIFIED_BUSINESS_INFO.phoneRaw}`}
              className="flex items-center gap-1.5 text-white font-semibold hover:text-[#21AAA5] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#21AAA5]" />
              <span>{VERIFIED_BUSINESS_INFO.phone}</span>
            </a>
          </div>
        </Container>
      </div>

      <div
        className={cn(
          "w-full bg-white transition-all duration-200",
          isScrolled ? "shadow-md py-3 border-b border-gray-100" : "py-4 border-b border-gray-100"
        )}
      >
        <Container className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#21AAA5] rounded-sm"
            aria-label="PackagingHype Home"
          >
            <Image
              src="/logo.png"
              alt="Packaging Hype"
              width={180}
              height={56}
              priority
              className="h-9 sm:h-11 w-auto rounded-sm"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-3" aria-label="Main Navigation">
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("industries")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href="/industries"
                aria-expanded={openDropdown === "industries"}
                aria-haspopup="true"
                className={cn(navLinkClass, "inline-flex items-center gap-1")}
              >
                <span>Industries</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    openDropdown === "industries" ? "rotate-180 text-[#FF5548]" : ""
                  )}
                />
              </Link>

              {openDropdown === "industries" && (
                <div className="absolute top-full left-0 w-[520px] bg-white rounded-lg shadow-xl border border-gray-100 p-5 grid grid-cols-2 gap-1 z-50">
                  <div className="col-span-2 pb-2 mb-1 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Shop by Industry
                    </span>
                    <Link
                      href="/industries"
                      className="text-xs font-semibold text-[#21AAA5] hover:text-[#172455]"
                    >
                      View All →
                    </Link>
                  </div>
                  {industries.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/categories/${item.slug}`}
                      className="px-3 py-2 text-sm font-semibold text-[#172455] rounded hover:bg-[#F6F8FA] hover:text-[#FF5548] transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("materials")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href="/box-by-material"
                aria-expanded={openDropdown === "materials"}
                aria-haspopup="true"
                className={cn(navLinkClass, "inline-flex items-center gap-1")}
              >
                <span>Box by Material</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    openDropdown === "materials" ? "rotate-180 text-[#FF5548]" : ""
                  )}
                />
              </Link>

              {openDropdown === "materials" && (
                <div className="absolute top-full left-0 w-[280px] bg-white rounded-lg shadow-xl border border-gray-100 p-3 z-50">
                  {materials.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/categories/${item.slug}`}
                      className="block px-3 py-2.5 text-sm font-semibold text-[#172455] rounded hover:bg-[#F6F8FA] hover:text-[#FF5548] transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href="/box-by-material"
                    className="mt-1 block border-t border-gray-100 px-3 pt-3 pb-1 text-xs font-semibold text-[#21AAA5] hover:text-[#172455]"
                  >
                    View All Materials →
                  </Link>
                </div>
              )}
            </div>

            <Link href="/shapes-styles" className={navLinkClass}>
              Shapes & Styles
            </Link>

            <Link href="/contact-us" className={navLinkClass}>
              Contact Us
            </Link>

            <Link href="/blog" className={navLinkClass}>
              Blogs
            </Link>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen((v) => !v)}
              className="p-2 text-[#172455] hover:text-[#FF5548] rounded-md focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              aria-label={isSearchOpen ? "Close search" : "Open search"}
              aria-expanded={isSearchOpen}
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            <Link
              href="/cart"
              className="relative p-2 text-[#172455] hover:text-[#FF5548] rounded-md focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              aria-label={`View cart${itemCount ? `, ${itemCount} items` : ""}`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF5548] px-1 text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            </Link>

            <Button
              href="/quote"
              variant="primary"
              size="md"
              className="hidden sm:inline-flex shadow-sm ml-1"
            >
              <SendHorizontal className="w-4 h-4 mr-1.5" />
              <span>Get a Quote</span>
            </Button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#172455] hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </Container>
      </div>

      {isSearchOpen ? (
        <div className="border-b border-gray-100 bg-white">
          <Container className="py-3">
            <form onSubmit={onSearchSubmit} className="relative max-w-2xl ml-auto">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, boxes, materials..."
                className="w-full rounded-[4px] border border-[#E2E4E8] bg-[#F6F8FA] py-2.5 pl-10 pr-24 text-sm text-[#172455] outline-none focus:border-[#FF5548] focus:bg-white"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-[4px] bg-[#FF5548] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#e04337]"
              >
                Search
              </button>
            </form>
          </Container>
        </div>
      ) : null}

      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        industries={industries}
        materials={materials}
      />
    </header>
  );
}
