"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FaqAccentHeading, FAQAccordion } from "@/components/ui/FAQAccordion";
import { SafeImage } from "@/components/ui/SafeImage";
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
    <section className="bg-[#F6F8FA] py-8 sm:py-10 lg:py-12">
      <Container className="max-w-6xl">
        <div className="max-w-2xl text-left">
          <FaqAccentHeading text={title} />
          {subheading?.trim() ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280] sm:text-[15px]">
              {subheading}
            </p>
          ) : null}
        </div>

        {hasImage ? (
          <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:mt-8 lg:grid-cols-12 lg:gap-8">
            <div className="min-w-0 lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white shadow-sm">
                <SafeImage
                  src={imageUrl!}
                  alt={imageAlt || title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover object-center"
                  unoptimized={imageUrl!.startsWith("http")}
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-col justify-between lg:col-span-7">
              <div className="max-h-[320px] overflow-y-auto pr-1 [scrollbar-width:thin]">
                <FAQAccordion items={items} variant="pills" />
              </div>
              <div className="mt-3.5 flex items-center justify-between border-t border-gray-200/80 pt-2.5">
                <div>
                  <p className="font-heading text-xs font-bold text-[#172455] sm:text-[13px]">
                    Still have a question?
                  </p>
                  <p className="text-[11px] text-[#6B7280]">
                    Our packaging experts are available Monday–Friday.
                  </p>
                </div>
                <Link
                  href="/contact-us"
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF5548] hover:underline"
                >
                  Contact support
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 max-w-3xl">
            <FAQAccordion items={items} variant="pills" />
            <div className="mt-4 flex items-center justify-between border-t border-gray-200/80 pt-3">
              <div>
                <p className="font-heading text-xs font-bold text-[#172455] sm:text-[13px]">
                  Still have a question?
                </p>
                <p className="text-[11px] text-[#6B7280]">
                  Our packaging experts are available Monday–Friday.
                </p>
              </div>
              <Link
                href="/contact-us"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF5548] hover:underline"
              >
                Contact support
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
