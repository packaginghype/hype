"use client";

import React, { FormEvent, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Phone,
  Menu,
  ChevronDown,
  SendHorizontal,
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
type DropdownKey = "categories" | "industries" | "materials" | null;

const QUICK_SEARCHES = [
  { label: "Kraft Boxes", href: "/search?q=kraft" },
  { label: "Mailer Boxes", href: "/search?q=mailer" },
  { label: "Rigid Boxes", href: "/search?q=rigid" },
  { label: "Cosmetic Boxes", href: "/search?q=cosmetic" },
] as const;

export function Header({
  categories,
  industries,
  materials,
  logoUrl,
  logoAlt,
}: {
  categories: NavLink[];
  industries: NavLink[];
  materials: NavLink[];
  logoUrl?: string;
  logoAlt?: string;
}) {
  const router = useRouter();
  const { itemCount } = useCart();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTitleId = useId();
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
    if (!isSearchOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = window.setTimeout(() => searchInputRef.current?.focus(), 40);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isSearchOpen]);

  function closeSearch() {
    setIsSearchOpen(false);
  }

  function onSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    closeSearch();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const navLinkClass =
    "px-3 py-2 text-sm font-semibold text-[#0B1220] hover:text-[#FF5548] rounded transition-colors";

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      <div
        className={cn(
          "w-full bg-white transition-all duration-200",
          isScrolled
            ? "border-b border-gray-100 py-2 shadow-md"
            : "border-b border-gray-100 py-2.5"
        )}
      >
        <Container className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
            aria-label={logoAlt || "PackagingHype Home"}
          >
            <Image
              src={logoUrl || "/logo.png"}
              alt={logoAlt || "Packaging Hype"}
              width={180}
              height={56}
              priority
              className="h-9 w-auto rounded-sm object-contain sm:h-11"
              unoptimized={Boolean(
                logoUrl?.endsWith(".svg") || logoUrl?.endsWith(".ico")
              )}
            />
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex xl:gap-3"
            aria-label="Main Navigation"
          >
            <div
              className="relative"
              onMouseEnter={() => categories.length > 0 && setOpenDropdown("categories")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href="/categories"
                aria-expanded={openDropdown === "categories"}
                aria-haspopup={categories.length > 0 ? "true" : undefined}
                className={cn(navLinkClass, "inline-flex items-center gap-1")}
              >
                <span>Categories</span>
                {categories.length > 0 && (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      openDropdown === "categories"
                        ? "rotate-180 text-[#FF5548]"
                        : ""
                    )}
                  />
                )}
              </Link>

              {openDropdown === "categories" && categories.length > 0 && (
                <div className="absolute left-0 top-full z-50 grid w-[480px] grid-cols-2 gap-1 rounded-lg border border-gray-100 bg-white p-5 shadow-xl">
                  <div className="col-span-2 mb-1 flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Shop by Category
                    </span>
                    <Link
                      href="/categories"
                      className="text-xs font-semibold text-[#21AAA5] hover:text-[#172455]"
                    >
                      View All →
                    </Link>
                  </div>
                  {categories.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${item.slug}`}
                      className="rounded px-3 py-2 text-sm font-semibold text-[#172455] transition-colors hover:bg-[#F6F8FA] hover:text-[#FF5548]"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => industries.length > 0 && setOpenDropdown("industries")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href="/industries"
                aria-expanded={openDropdown === "industries"}
                aria-haspopup={industries.length > 0 ? "true" : undefined}
                className={cn(navLinkClass, "inline-flex items-center gap-1")}
              >
                <span>Industries</span>
                {industries.length > 0 && (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      openDropdown === "industries"
                        ? "rotate-180 text-[#FF5548]"
                        : ""
                    )}
                  />
                )}
              </Link>

              {openDropdown === "industries" && industries.length > 0 && (
                <div className="absolute left-0 top-full z-50 grid w-[520px] grid-cols-2 gap-1 rounded-lg border border-gray-100 bg-white p-5 shadow-xl">
                  <div className="col-span-2 mb-1 flex items-center justify-between border-b border-gray-100 pb-2">
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
                      href={`/${item.slug}`}
                      className="rounded px-3 py-2 text-sm font-semibold text-[#172455] transition-colors hover:bg-[#F6F8FA] hover:text-[#FF5548]"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => materials.length > 0 && setOpenDropdown("materials")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href="/box-by-material"
                aria-expanded={openDropdown === "materials"}
                aria-haspopup={materials.length > 0 ? "true" : undefined}
                className={cn(navLinkClass, "inline-flex items-center gap-1")}
              >
                <span>Box by Material</span>
                {materials.length > 0 && (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      openDropdown === "materials"
                        ? "rotate-180 text-[#FF5548]"
                        : ""
                    )}
                  />
                )}
              </Link>

              {openDropdown === "materials" && materials.length > 0 && (
                <div className="absolute left-0 top-full z-50 w-[280px] rounded-lg border border-gray-100 bg-white p-3 shadow-xl">
                  {materials.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${item.slug}`}
                      className="block rounded px-3 py-2.5 text-sm font-semibold text-[#172455] transition-colors hover:bg-[#F6F8FA] hover:text-[#FF5548]"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href="/box-by-material"
                    className="mt-1 block border-t border-gray-100 px-3 pb-1 pt-3 text-xs font-semibold text-[#21AAA5] hover:text-[#172455]"
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

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="rounded-md p-2 text-[#172455] transition-colors hover:bg-[#F6F8FA] hover:text-[#FF5548] focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>

            <a
              href={`tel:${VERIFIED_BUSINESS_INFO.phoneRaw}`}
              className="hidden sm:inline-flex items-center justify-center rounded-full p-1.5 text-[#21AAA5] transition-colors hover:bg-[#EAF7F6] hover:text-[#178f8b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#21AAA5]/40"
              aria-label={`Call ${VERIFIED_BUSINESS_INFO.phone}`}
              title={VERIFIED_BUSINESS_INFO.phone}
            >
              <Phone className="h-5 w-5" strokeWidth={2} />
            </a>

            <Link
              href="/cart"
              className="relative hidden sm:block rounded-md p-2 text-[#172455] transition-colors hover:bg-[#F6F8FA] hover:text-[#FF5548] focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
              aria-label={`View cart${itemCount ? `, ${itemCount} items` : ""}`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF5548] px-1 text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            </Link>

            <Button
              href="/quote"
              variant="primary"
              size="md"
              className="ml-1 hidden shadow-sm lg:inline-flex"
            >
              <SendHorizontal className="mr-1.5 h-4 w-4" />
              <span>Get a Quote</span>
            </Button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-[#172455] shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#21AAA5] lg:hidden"
              aria-label="Open mobile navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </Container>
      </div>

      {isSearchOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={searchTitleId}
        >
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 bg-[#0B1A2E]/70 backdrop-blur-md transition-opacity"
            onClick={closeSearch}
          />

          <button
            type="button"
            onClick={closeSearch}
            className="absolute right-5 top-5 z-20 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:right-8 sm:top-8"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          <form
            onSubmit={onSearchSubmit}
            className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6 px-2 sm:gap-8"
          >
            <p
              id={searchTitleId}
              className="text-center text-sm font-bold uppercase tracking-[0.18em] text-white sm:text-base"
            >
              Start typing and press enter
            </p>

            <label htmlFor="header-search-input" className="sr-only">
              Search products
            </label>
            <div className="relative flex w-full max-w-2xl px-2 sm:px-4">
              <input
                id="header-search-input"
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                className="w-full border-0 border-b-2 border-white bg-transparent px-2 py-3 pr-12 text-xl text-white outline-none placeholder:text-white/50 sm:px-4 sm:text-2xl"
                placeholder=""
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white transition-transform hover:scale-110 sm:right-4"
                aria-label="Search"
              >
                <Search className="h-6 w-6" strokeWidth={2} />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {QUICK_SEARCHES.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSearch}
                  className="rounded-full border border-white/25 bg-white/5 px-3.5 py-1.5 text-[12.5px] font-semibold text-white/90 transition-colors hover:border-white/50 hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </form>
        </div>
      ) : null}

      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
        industries={industries}
        materials={materials}
        logoUrl={logoUrl}
        logoAlt={logoAlt}
      />
    </header>
  );
}
