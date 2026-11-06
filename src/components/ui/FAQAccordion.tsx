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
  /** UmraZone-style pill rows (default). Legacy "panel" kept as alias. */
  variant?: "default" | "panel" | "pills";
}

/** Accent the last word with a soft coral underline (UmraZone-style). */
export function FaqAccentHeading({
  text,
  as: Tag = "h2",
  className,
}: {
  text: string;
  as?: "h2" | "h3";
  className?: string;
}) {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;
  const last = parts[parts.length - 1];
  const lead = parts.slice(0, -1).join(" ");

  return (
    <Tag
      className={cn(
        "font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-[2rem] sm:leading-tight",
        className
      )}
    >
      {lead ? <>{lead} </> : null}
      <span className="relative inline-block">
        {last}
        <svg
          aria-hidden
          viewBox="0 0 120 10"
          className="pointer-events-none absolute -bottom-1 left-0 h-[8px] w-full text-[#FF5548]"
          preserveAspectRatio="none"
        >
          <path
            d="M2 7 C 30 2, 70 10, 118 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </Tag>
  );
}

export function FAQAccordion({
  items,
  allowMultiple = false,
  variant = "pills",
}: FAQAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const style = variant === "panel" ? "pills" : variant;

  const toggleIndex = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  if (style === "pills") {
    return (
      <div className="space-y-3 sm:space-y-3.5">
        {items.map((item, index) => {
          const isOpen = openIndexes.includes(index);
          const buttonId = `faq-pill-btn-${index}`;
          const panelId = `faq-pill-body-${index}`;

          return (
            <div
              key={index}
              className={cn(
                "overflow-hidden rounded-[999px] border border-[#E8E0D6] bg-white shadow-[0_1px_0_rgba(23,36,85,0.04)] transition-all",
                isOpen && "rounded-[28px] shadow-[0_10px_30px_-18px_rgba(23,36,85,0.28)]"
              )}
            >
              <h3 className="m-0 p-0">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleIndex(index)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:gap-4 sm:px-5 sm:py-4"
                >
                  <span className="min-w-0 flex-1 font-heading text-[14.5px] font-bold leading-snug tracking-tight text-[#172455] sm:text-[16px]">
                    {item.question}
                  </span>
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors sm:h-10 sm:w-10",
                      isOpen
                        ? "border-[#FF5548] bg-[#FF5548] text-white"
                        : "border-[#D6C4A8] bg-white text-[#8B7355]"
                    )}
                  >
                    {isOpen ? (
                      <Minus className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-4 w-4" strokeWidth={2.5} />
                    )}
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="px-4 pb-4 pr-14 sm:px-5 sm:pb-5 sm:pr-16">
                    {looksLikeHtml(item.answer) ? (
                      <RichText
                        html={item.answer}
                        className="text-[13.5px] leading-relaxed text-[#5B667A] sm:text-[14px]"
                      />
                    ) : (
                      <p className="text-[13.5px] leading-relaxed text-[#5B667A] sm:text-[14px]">
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

  // Legacy default (rarely used)
  return (
    <div className="divide-y divide-gray-200 border-b border-t border-gray-200">
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        const buttonId = `faq-btn-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div key={index} className="py-4 sm:py-5">
            <h3 className="m-0 p-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleIndex(index)}
                className="flex w-full items-center justify-between rounded text-left focus:outline-none focus:ring-2 focus:ring-[#21AAA5] focus:ring-offset-2"
              >
                <span className="font-heading pr-4 text-base font-bold tracking-tight text-[#172455] sm:text-[17px]">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D6C4A8] bg-white text-[#8B7355]",
                    isOpen && "border-[#FF5548] bg-[#FF5548] text-white"
                  )}
                >
                  {isOpen ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </span>
              </button>
            </h3>
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
