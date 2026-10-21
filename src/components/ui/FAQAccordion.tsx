"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQItem } from "@/types";
import { RichText } from "@/components/ui/RichText";
import { looksLikeHtml } from "@/lib/html";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  items: FAQItem[];
  allowMultiple?: boolean;
  variant?: "default" | "panel";
}

export function FAQAccordion({
  items,
  allowMultiple = false,
  variant = "default",
}: FAQAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const toggleIndex = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  if (variant === "panel") {
    return (
      <div className="divide-y divide-[#E5E9F0]">
        {items.map((item, index) => {
          const isOpen = openIndexes.includes(index);
          const buttonId = `faq-panel-btn-${index}`;
          const panelId = `faq-panel-body-${index}`;

          return (
            <div key={index} className="py-3.5 sm:py-4">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleIndex(index)}
                className="flex w-full items-start justify-between gap-3 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#21AAA5]"
              >
                <span className="text-[14px] font-bold leading-snug text-[#172455] sm:text-[15px]">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
                    isOpen
                      ? "bg-[#EAF7F6] text-[#21AAA5]"
                      : "bg-white text-[#172455] shadow-sm"
                  )}
                >
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </span>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="pt-2.5">
                    {looksLikeHtml(item.answer) ? (
                      <RichText
                        html={item.answer}
                        className="pr-8 text-[13px] leading-relaxed text-[#5B667A] sm:text-[13.5px]"
                      />
                    ) : (
                      <p className="pr-8 text-[13px] leading-relaxed text-[#5B667A] sm:text-[13.5px]">
                        {item.answer}
                      </p>
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

  return (
    <div className="divide-y divide-gray-200 border-b border-t border-gray-200">
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        const buttonId = `faq-btn-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div key={index} className="py-4 sm:py-5">
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleIndex(index)}
              className="flex w-full items-center justify-between rounded text-left focus:outline-none focus:ring-2 focus:ring-[#21AAA5] focus:ring-offset-2"
            >
              <span className="pr-4 text-base font-bold text-[#172455] sm:text-lg">
                {item.question}
              </span>
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F6F8FA] text-[#172455] transition-transform duration-200",
                  isOpen ? "rotate-180 bg-[#eaf7f6] text-[#21AAA5]" : ""
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="pt-3">
                  <p className="pr-6 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
