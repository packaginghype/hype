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
  ArrowRight,
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
  { label: "Kraft Boxes", href: "/products?q=kraft" },
  { label: "Mailer Boxes", href: "/products?q=mailer" },
  { label: "Rigid Boxes", href: "/products?q=rigid" },
  { label: "Cosmetic Boxes", href: "/products?q=cosmetic" },
] as const;

export function Header({
  categories,
  industries,
  materials,
}: {
  categories: NavLink[];
  industries: NavLink[];
  materials: NavLink[];
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
    router.push(`/products?q=${encodeURIComponent(q)}`);
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
            aria-label="PackagingHype Home"
          >
            <Image
              src="/logo.png"
              alt="Packaging Hype"
              width={180}
              height={56}
              priority
              className="h-9 w-auto rounded-sm sm:h-11"
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
                      href={`/category/${item.slug}`}
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
                      href={`/industry/${item.slug}`}
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
                      href={`/box-by-material/${item.slug}`}
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
              className="inline-flex items-center justify-center rounded-full p-1.5 text-[#21AAA5] transition-colors hover:bg-[#EAF7F6] hover:text-[#178f8b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#21AAA5]/40"
              aria-label={`Call ${VERIFIED_BUSINESS_INFO.phone}`}
              title={VERIFIED_BUSINESS_INFO.phone}
            >
              <Phone className="h-5 w-5" strokeWidth={2} />
            </a>

            <Link
              href="/cart"
              className="relative rounded-md p-2 text-[#172455] transition-colors hover:bg-[#F6F8FA] hover:text-[#FF5548] focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
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
              className="ml-1 hidden shadow-sm sm:inline-flex"
            >
              <SendHorizontal className="mr-1.5 h-4 w-4" />
              <span>Get a Quote</span>
            </Button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-md p-2 text-[#172455] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#21AAA5] lg:hidden"
              aria-label="Open mobile navigation"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </Container>
      </div>

      {isSearchOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pb-8 pt-[12vh] sm:pt-[16vh]">
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 bg-[#0F1839]/55 backdrop-blur-[3px] transition-opacity"
            onClick={closeSearch}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={searchTitleId}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-[14px] border border-white/20 bg-white shadow-[0_24px_80px_-20px_rgba(15,24,57,0.55)]"
          >
            <div className="flex items-center justify-between border-b border-[#EEF1F6] px-4 py-3 sm:px-5">
              <div>
                <p
                  id={searchTitleId}
                  className="text-sm font-bold text-[#172455]"
                >
                  Search products
                </p>
                <p className="mt-0.5 text-[12px] text-[#6B7280]">
                  Find boxes by name, material, or style
                </p>
              </div>
              <button
                type="button"
                onClick={closeSearch}
                className="rounded-md p-2 text-[#6B7280] transition-colors hover:bg-[#F6F8FA] hover:text-[#172455]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={onSearchSubmit} className="p-4 sm:p-5">
              <label htmlFor="header-search-input" className="sr-only">
                Search products
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  id="header-search-input"
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try kraft boxes, mailers, rigid…"
                  autoComplete="off"
                  className="w-full rounded-[10px] border border-[#E2E4E8] bg-[#F8FAFC] py-3.5 pl-11 pr-[7.5rem] text-[15px] text-[#172455] outline-none transition-[border-color,background-color,box-shadow] placeholder:text-[#9CA3AF] focus:border-[#FF5548] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,85,72,0.12)]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-[8px] bg-[#FF5548] px-3.5 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#e04337]"
                >
                  Search
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">
                  Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SEARCHES.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSearch}
                      className="rounded-full border border-[#E8EAEF] bg-[#F8FAFC] px-3 py-1.5 text-[12.5px] font-semibold text-[#172455] transition-colors hover:border-[#FF5548]/40 hover:bg-[#FFF5F4] hover:text-[#FF5548]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <p className="mt-4 hidden items-center gap-2 text-[11px] text-[#9CA3AF] sm:flex">
                <kbd className="rounded border border-[#E2E4E8] bg-[#F6F8FA] px-1.5 py-0.5 font-sans text-[10px] font-semibold text-[#6B7280]">
                  Esc
                </kbd>
                to close
              </p>
            </form>
          </div>
        </div>
      ) : null}

      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
        industries={industries}
        materials={materials}
      />
    </header>
  );
}
