"use client";

import Image from "next/image";
import { FaqAccentHeading, FAQAccordion } from "@/components/ui/FAQAccordion";
import type { FAQItem } from "@/types";

export function BlogFaqSection({
  heading,
  subheading,
  items,
  imageUrl,
  imageAlt,
}: {
  heading?: string | null;
  subheading?: string | null;
  items: FAQItem[];
  imageUrl?: string | null;
  imageAlt?: string | null;
}) {
  if (!items.length) return null;

  const title = heading?.trim() || "Frequently Asked Questions";
  const hasImage = Boolean(imageUrl?.trim());

  return (
    <section className="mt-16 rounded-[18px] border border-[#EDE6DB] bg-[#F7F3EC] p-5 sm:p-8">
      <div className="max-w-2xl">
        <FaqAccentHeading text={title} />
        {subheading?.trim() ? (
          <p className="mt-3 text-sm leading-relaxed text-[#6B7280] sm:text-[15px]">
            {subheading}
          </p>
        ) : null}
      </div>

      <div
        className={`mt-8 grid gap-8 ${
          hasImage ? "lg:grid-cols-2 lg:items-start" : ""
        }`}
      >
        <FAQAccordion items={items} variant="pills" />
        {hasImage ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-[#EDE6DB]">
            <Image
              src={imageUrl!}
              alt={imageAlt || title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
