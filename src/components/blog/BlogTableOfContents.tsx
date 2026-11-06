"use client";

import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, ListFilter } from "lucide-react";

export type TocItem = { id: string; text: string; level: 2 | 3 };

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function BlogTableOfContents({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "0% 0% -65% 0%", threshold: 0.1 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const renderItems = () => (
    <nav aria-label="Table of contents navigation">
      <ul className="space-y-1 text-xs">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={cn("relative transition-all", item.level === 3 && "ml-3.5")}
            >
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-center gap-2.5 rounded-full px-3 py-2 text-[13px] leading-snug transition-all duration-200",
                  isActive
                    ? "bg-[#172455] text-white font-semibold shadow-sm"
                    : "text-[#4A5568] hover:bg-[#F6F8FA] hover:text-[#172455]"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500 group-hover:bg-[#FF5548]/15 group-hover:text-[#FF5548]"
                  )}
                >
                  {index + 1}
                </span>
                <span className="line-clamp-2">{item.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Mobile Drawer Accordion */}
      <div className="mb-8 rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm lg:hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-[#172455]"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className="inline-flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-[#FF5548]" />
            <span>Table of Contents</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="rounded-full bg-[#FFF1F0] px-2 py-0.5 text-[10px] font-bold text-[#FF5548]">
              {items.length} SECTIONS
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform duration-200",
                open && "rotate-180 text-[#FF5548]"
              )}
            />
          </span>
        </button>
        {open ? (
          <div className="mt-3.5 border-t border-gray-100 pt-3.5">{renderItems()}</div>
        ) : null}
      </div>

      {/* Desktop Sticky Rail */}
      <div className="sticky top-24 hidden space-y-5 lg:block">
        <div className="rounded-[24px] border border-gray-200/90 bg-white p-5 shadow-[0_8px_28px_-16px_rgba(23,36,85,0.08)]">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 text-xs font-bold uppercase tracking-wider text-[#172455]">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[#FF5548]" />
              <span>Table of Contents</span>
            </span>
            <span className="rounded-full bg-[#FFF1F0] px-2.5 py-0.5 text-[10px] font-bold text-[#FF5548]">
              {items.length} SECTIONS
            </span>
          </div>
          <div className="mt-3.5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
            {renderItems()}
          </div>
        </div>
      </div>
    </>
  );
}
