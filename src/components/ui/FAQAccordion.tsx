"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { FAQItem } from "@/types";
import { RichText } from "@/components/ui/RichText";
import { looksLikeHtml } from "@/lib/html";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  items: FAQItem[];
  allowMultiple?: boolean;
  variant?: "default" | "panel" | "pills";
}

/** Clean heading consistent with Packaging Hype corporate theme (no SVG squiggly underline). */
export function FaqAccentHeading({
  text,
  as: Tag = "h2",
  className,
}: {
  text: string;
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl lg:text-[2rem] lg:leading-tight",
        className
      )}
    >
      {text}
    </Tag>
  );
}

export function FAQAccordion({
  items,
  allowMultiple = false,
  variant = "pills",
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
              <h3 className="m-0 p-0">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleIndex(index)}
                  className="flex w-full items-start justify-between gap-3 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#21AAA5]"
                >
                  <span className="font-heading text-[15px] font-bold leading-snug tracking-tight text-[#172455] sm:text-[16px]">
                    {item.question}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
                      isOpen
                        ? "bg-[#172455] text-white"
                        : "bg-[#EEF2F6] text-[#172455]"
                    )}
                  >
                    {isOpen ? (
                      <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                    ) : (
                      <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                    )}
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
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
    <div className="space-y-2.5 sm:space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        const buttonId = `faq-btn-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div
            key={index}
            className={cn(
              "overflow-hidden rounded-[16px] border bg-white transition-all duration-200",
              isOpen
                ? "border-[#172455]/30 shadow-[0_4px_16px_-6px_rgba(23,36,85,0.10)]"
                : "border-[#E5E7EB] hover:border-[#D1D5DB]"
            )}
          >
            <h3 className="m-0 p-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleIndex(index)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors sm:px-5 sm:py-3.5"
              >
                <span
                  className={cn(
                    "min-w-0 flex-1 font-heading text-[14.5px] font-bold leading-snug tracking-tight transition-colors sm:text-[15.5px]",
                    isOpen ? "text-[#FF5548]" : "text-[#172455]"
                  )}
                >
                  {item.question}
                </span>
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 sm:h-8 sm:w-8",
                    isOpen
                      ? "border-[#FF5548] bg-[#FF5548] text-white"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100"
                  )}
                >
                  {isOpen ? (
                    <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                  ) : (
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  )}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="border-t border-gray-100 px-4 pt-3 pb-3.5 sm:px-5 sm:pt-3 sm:pb-4">
                  {looksLikeHtml(item.answer) ? (
                    <RichText
                      html={item.answer}
                      className="text-[13.5px] leading-relaxed text-[#4A5568] sm:text-[14px]"
                    />
                  ) : (
                    <p className="text-[13.5px] leading-relaxed text-[#4A5568] sm:text-[14px]">
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
