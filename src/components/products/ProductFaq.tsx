"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQItem } from "@/types";
import { cn } from "@/lib/utils";

export function ProductFaq({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className={cn(index > 0 && "border-t border-[#E5E7EB]")}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5 sm:py-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF5548] text-white">
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </span>
              <span className="text-sm font-semibold text-[#111111] sm:text-[15px]">
                {item.question}
              </span>
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <p className="px-4 pb-4 pl-[3.75rem] text-sm leading-relaxed text-[#555] sm:px-5 sm:pb-5 sm:pl-[4.25rem]">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
