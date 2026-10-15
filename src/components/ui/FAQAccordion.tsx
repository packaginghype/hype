"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQItem } from "@/types";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  items: FAQItem[];
  allowMultiple?: boolean;
}

export function FAQAccordion({
  items,
  allowMultiple = false,
}: FAQAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // First open by default

  const toggleIndex = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
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
              className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#21AAA5] focus:ring-offset-2 rounded"
            >
              <span className="text-base sm:text-lg font-bold text-[#172455] pr-4">
                {item.question}
              </span>
              <span
                className={cn(
                  "shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#F6F8FA] text-[#172455] transition-transform duration-200",
                  isOpen ? "rotate-180 bg-[#eaf7f6] text-[#21AAA5]" : ""
                )}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
              )}
            >
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed pr-6">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
