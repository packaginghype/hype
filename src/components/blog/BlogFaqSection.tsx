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
    <section className="bg-[#F7F3EC] py-10 sm:py-12 lg:py-16">
      <Container className="max-w-6xl">
        <div className="max-w-2xl text-left">
          <FaqAccentHeading text={title} />
          {subheading?.trim() ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6B7280] sm:text-[15px]">
              {subheading}
            </p>
          ) : null}
        </div>

        {hasImage ? (
          <div className="mt-8 grid grid-cols-1 items-center gap-6 lg:mt-10 lg:grid-cols-2 lg:gap-10">
            <div className="relative aspect-square overflow-hidden rounded-[22px] bg-[#EDE6DB] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[460px]">
              <SafeImage
                src={imageUrl!}
                alt={imageAlt || title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                unoptimized={imageUrl!.startsWith("http")}
              />
            </div>

            <div className="min-w-0">
              <FAQAccordion items={items} variant="pills" />
              <div className="mt-5 px-1">
                <p className="font-heading text-[15px] font-bold text-[#172455]">
                  Still have a question?
                </p>
                <p className="mt-0.5 text-[13px] text-[#6B7280]">
                  Our packaging experts are available Monday–Friday.
                </p>
                <Link
                  href="/contact-us"
                  className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#21AAA5] transition-colors hover:text-[#FF5548]"
                >
                  Contact support
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 max-w-3xl">
            <FAQAccordion items={items} variant="pills" />
            <div className="mt-5 px-1">
              <p className="font-heading text-[15px] font-bold text-[#172455]">
                Still have a question?
              </p>
              <p className="mt-0.5 text-[13px] text-[#6B7280]">
                Our packaging experts are available Monday–Friday.
              </p>
              <Link
                href="/contact-us"
                className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#21AAA5] transition-colors hover:text-[#FF5548]"
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
