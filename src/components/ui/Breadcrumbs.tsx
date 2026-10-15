import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-xs text-gray-500">
      <ol className="flex items-center flex-wrap gap-2">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center hover:text-[#172455] transition-colors focus:outline-none focus:underline"
          >
            <Home className="w-3.5 h-3.5 mr-1" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-[#172455] transition-colors focus:outline-none focus:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-[#172455] line-clamp-1" aria-current="page">
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
