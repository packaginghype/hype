import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Slash style like packaging reference: 🏠 Home / Category / Product */
  variant?: "default" | "slash";
  /** White text for use on dark/image backgrounds */
  light?: boolean;
  className?: string;
}

/** Outlined house icon — consistent across both breadcrumb variants */
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M3 9.75L12 3l9 6.75V21a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.75Z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

export function Breadcrumbs({ items, variant = "default", light = false, className }: BreadcrumbsProps) {
  if (variant === "slash") {
    return (
      <nav aria-label="Breadcrumb" className={`text-[13px] leading-none ${className ?? ""}`}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <li className="flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[#FF5548] transition-opacity hover:opacity-75"
              aria-label="Home"
            >
              <HomeIcon className="h-[14px] w-[14px]" />
              <span className="font-medium">Home</span>
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
                    className="font-semibold text-[#222]"
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

  // ── default variant ────────────────────────────────────────────────────────
  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-3 text-xs ${light ? "text-white/80" : "text-gray-500"} ${className ?? ""}`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li className="flex items-center">
          <Link
            href="/"
            className={`flex items-center gap-1 transition-colors focus:underline focus:outline-none ${
              light ? "text-white/80 hover:text-white" : "text-gray-500 hover:text-[#172455]"
            }`}
          >
            <HomeIcon className="h-3.5 w-3.5 shrink-0" />
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
                  className={`transition-colors focus:underline focus:outline-none ${
                    light ? "text-white/80 hover:text-white" : "hover:text-[#172455]"
                  }`}
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
