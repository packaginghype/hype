"use client";

import type { FAQItem } from "@/types";
import { FAQAccordion } from "@/components/ui/FAQAccordion";

/** Product FAQs — UmraZone-style pill accordion. */
export function ProductFaq({ items }: { items: FAQItem[] }) {
  return <FAQAccordion items={items} variant="pills" />;
}
