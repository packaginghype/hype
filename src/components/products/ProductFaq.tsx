"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQItem } from "@/types";
import { RichText } from "@/components/ui/RichText";
import { looksLikeHtml } from "@/lib/html";
import { cn } from "@/lib/utils";

export function ProductFaq({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={`${item.question}-${index}`}
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
                "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="px-4 pb-4 pl-[3.75rem] text-sm leading-relaxed text-[#555] sm:px-5 sm:pb-5 sm:pl-[4.25rem]">
                  {looksLikeHtml(item.answer) ? (
                    <RichText html={item.answer} />
                  ) : (
                    <p>{item.answer}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
