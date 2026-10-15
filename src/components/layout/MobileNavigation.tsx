"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Phone, Mail, ChevronDown, ArrowRight } from "lucide-react";
import { VERIFIED_BUSINESS_INFO } from "@/data/verified-data";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type NavLink = { name: string; slug: string };

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  industries: NavLink[];
  materials: NavLink[];
}

export function MobileNavigation({
  isOpen,
  onClose,
  industries,
  materials,
}: MobileNavigationProps) {
  const [openSection, setOpenSection] = useState<"industries" | "materials" | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setOpenSection(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Packaging Hype"
              width={150}
              height={48}
              className="h-9 w-auto rounded-sm"
            />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-[#172455] rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#21AAA5]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="flex items-center rounded hover:bg-[#F6F8FA]">
            <Link
              href="/industries"
              onClick={onClose}
              className="flex-1 px-3 py-2.5 text-base font-semibold text-[#172455]"
            >
              Industries
            </Link>
            <button
              type="button"
              onClick={() =>
                setOpenSection((prev) => (prev === "industries" ? null : "industries"))
              }
              className="px-3 py-2.5 text-[#172455]"
              aria-expanded={openSection === "industries"}
              aria-label="Toggle industries list"
            >
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  openSection === "industries" && "rotate-180 text-[#FF5548]"
                )}
              />
            </button>
          </div>
          {openSection === "industries" && (
            <div className="ml-2 pl-3 border-l border-gray-200 space-y-0.5 mb-2">
              {industries.map((item) => (
                <Link
                  key={item.slug}
                  href={`/categories/${item.slug}`}
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-gray-700 rounded hover:bg-[#F6F8FA] hover:text-[#FF5548]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center rounded hover:bg-[#F6F8FA]">
            <Link
              href="/box-by-material"
              onClick={onClose}
              className="flex-1 px-3 py-2.5 text-base font-semibold text-[#172455]"
            >
              Box by Material
            </Link>
            <button
              type="button"
              onClick={() =>
                setOpenSection((prev) => (prev === "materials" ? null : "materials"))
              }
              className="px-3 py-2.5 text-[#172455]"
              aria-expanded={openSection === "materials"}
              aria-label="Toggle materials list"
            >
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  openSection === "materials" && "rotate-180 text-[#FF5548]"
                )}
              />
            </button>
          </div>
          {openSection === "materials" && (
            <div className="ml-2 pl-3 border-l border-gray-200 space-y-0.5 mb-2">
              {materials.map((item) => (
                <Link
                  key={item.slug}
                  href={`/categories/${item.slug}`}
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-gray-700 rounded hover:bg-[#F6F8FA] hover:text-[#FF5548]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/shapes-styles"
            onClick={onClose}
            className="block px-3 py-2.5 text-base font-semibold text-[#172455] rounded hover:bg-[#F6F8FA]"
          >
            Shapes & Styles
          </Link>

          <Link
            href="/contact-us"
            onClick={onClose}
            className="block px-3 py-2.5 text-base font-semibold text-[#172455] rounded hover:bg-[#F6F8FA]"
          >
            Contact Us
          </Link>

          <Link
            href="/blog"
            onClick={onClose}
            className="block px-3 py-2.5 text-base font-semibold text-[#172455] rounded hover:bg-[#F6F8FA]"
          >
            Blogs
          </Link>

          <div className="pt-4 mt-4 border-t border-gray-100 space-y-2 px-3 text-xs text-gray-600">
            <a
              href={`tel:${VERIFIED_BUSINESS_INFO.phoneRaw}`}
              className="flex items-center gap-2 text-gray-800 font-semibold hover:text-[#21AAA5]"
            >
              <Phone className="w-4 h-4 text-[#21AAA5]" />
              {VERIFIED_BUSINESS_INFO.phone}
            </a>
            <a
              href={`mailto:${VERIFIED_BUSINESS_INFO.email}`}
              className="flex items-center gap-2 hover:text-[#21AAA5]"
            >
              <Mail className="w-4 h-4 text-[#21AAA5]" />
              {VERIFIED_BUSINESS_INFO.email}
            </a>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-[#F6F8FA]">
          <Button href="/quote" variant="primary" size="md" fullWidth onClick={onClose}>
            <span>Request a Custom Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
