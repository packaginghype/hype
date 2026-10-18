import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Slash style like packaging reference: 🏠 / Category / Product */
  variant?: "default" | "slash";
  /** White text for use on dark/image backgrounds */
  light?: boolean;
  className?: string;
}

function HomeGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M9.293 1.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 10h-1v7a1 1 0 0 1-1 1h-3.5a.5.5 0 0 1-.5-.5V13a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v4.5a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1v-7H3a1 1 0 0 1-.707-1.707l7-7Z" />
    </svg>
  );
}

export function Breadcrumbs({ items, variant = "default", light = false, className }: BreadcrumbsProps) {
  if (variant === "slash") {
    return (
      <nav aria-label="Breadcrumb" className="text-[13px] leading-none">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[#FF5548]">
          <li className="flex items-center">
            <Link
              href="/"
              className="inline-flex h-[18px] w-[18px] items-center justify-center text-[#FF5548] transition-opacity hover:opacity-75"
              aria-label="Home"
            >
              <HomeGlyph className="h-[15px] w-[15px]" />
            </Link>
          </li>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} className="flex items-center gap-x-1.5 leading-[18px]">
                <span className="text-[#FF5548]" aria-hidden>
                  /
                </span>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-[#FF5548] transition-opacity hover:opacity-75"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="font-medium text-[#222]"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-3 text-xs ${light ? "text-white/80" : "text-gray-500"} ${className ?? ""}`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li className="flex items-center">
          <Link
            href="/"
            className={`flex items-center transition-colors focus:underline focus:outline-none ${light ? "text-white/80 hover:text-white" : "hover:text-[#172455]"}`}
          >
            <Home className="mr-1 h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-2">
              <span className={light ? "text-white/50" : "text-gray-400"} aria-hidden>
                /
              </span>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`transition-colors focus:underline focus:outline-none ${light ? "text-white/80 hover:text-white" : "hover:text-[#172455]"}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`line-clamp-1 font-semibold ${light ? "text-white" : "text-[#172455]"}`}
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
