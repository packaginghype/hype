import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { VERIFIED_FAQS } from "@/data/verified-data";
import type { HomePageData } from "@/lib/home-page-schema";
import { HOME_PAGE_DEFAULTS } from "@/lib/home-page-schema";

type Props = Pick<
  HomePageData,
  "faqEyebrow" | "faqHeading" | "faqSubtext" | "faqImageUrl" | "faqImageAlt" | "faqs"
>;

export function FaqSection({
  faqEyebrow = HOME_PAGE_DEFAULTS.faqEyebrow,
  faqHeading = HOME_PAGE_DEFAULTS.faqHeading,
  faqSubtext = HOME_PAGE_DEFAULTS.faqSubtext,
  faqImageUrl = HOME_PAGE_DEFAULTS.faqImageUrl,
  faqImageAlt = HOME_PAGE_DEFAULTS.faqImageAlt,
  faqs,
}: Partial<Props> = {}) {
  // Use admin FAQs if set, else fall back to hardcoded VERIFIED_FAQS
  const faqItems =
    faqs && faqs.length > 0
      ? faqs.map((f) => ({ question: f.question, answer: f.answer }))
      : VERIFIED_FAQS;

  return (
    <section className="border-t border-[#E8EAEF] bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          {faqEyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#21AAA5]">
              {faqEyebrow}
            </p>
          )}
          {faqHeading && (
            <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl">
              {faqHeading}
            </h2>
          )}
          {faqSubtext && (
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-[#5B667A] sm:text-[15px] lg:mx-0 mx-auto">
              {faqSubtext}
            </p>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 items-stretch gap-5 lg:mt-10 lg:grid-cols-2 lg:gap-6 lg:h-[540px] xl:h-[580px]">
          {/* Image panel */}
          <div className="relative min-h-[280px] overflow-hidden rounded-[16px] bg-[#EAF2ED] sm:min-h-[340px] lg:min-h-0 lg:h-full">
            <Image
              src={faqImageUrl || "/images/reliable-packaging-boxes.jpg"}
              alt={faqImageAlt || "Custom kraft packaging boxes from Packaging Hype"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F1839]/45 via-transparent to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <p className="max-w-xs text-[13px] font-semibold leading-snug text-white sm:text-sm">
                Custom sizes, materials, and finishes — built for your brand.
              </p>
              <Link
                href="/quote"
                className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-white transition-colors hover:text-[#FF5548]"
              >
                Get a free quote
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* FAQ panel */}
          <div className="flex min-h-0 flex-col overflow-hidden rounded-[16px] border border-[#E5E9F0] bg-[#F8FAFC] lg:h-full">
            <div className="faq-scroll min-h-0 flex-1 overflow-y-auto px-4 py-2 sm:px-5 sm:py-3">
              <FAQAccordion items={faqItems} variant="panel" />
            </div>
            <div className="shrink-0 border-t border-[#E5E9F0] bg-white px-4 py-4 sm:px-5">
              <p className="text-[13px] font-bold text-[#172455]">
                Still have a technical question?
              </p>
              <p className="mt-0.5 text-[12.5px] text-[#6B7280]">
                Our prepress team is available Monday–Friday.
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
      </Container>
    </section>
  );
}
