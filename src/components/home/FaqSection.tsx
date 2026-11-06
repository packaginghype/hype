import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FAQAccordion, FaqAccentHeading } from "@/components/ui/FAQAccordion";
import { VERIFIED_FAQS } from "@/data/verified-data";
import type { HomePageData } from "@/lib/home-page-schema";
import { HOME_PAGE_DEFAULTS } from "@/lib/home-page-schema";

type Props = Pick<
  HomePageData,
  "faqHeading" | "faqSubtext" | "faqImageUrl" | "faqImageAlt" | "faqs"
>;

export function FaqSection({
  faqHeading = HOME_PAGE_DEFAULTS.faqHeading,
  faqSubtext = HOME_PAGE_DEFAULTS.faqSubtext,
  faqImageUrl = HOME_PAGE_DEFAULTS.faqImageUrl,
  faqImageAlt = HOME_PAGE_DEFAULTS.faqImageAlt,
  faqs,
}: Partial<Props> = {}) {
  const faqItems =
    faqs && faqs.length > 0
      ? faqs.map((f) => ({ question: f.question, answer: f.answer }))
      : VERIFIED_FAQS;

  const heading =
    faqHeading?.trim() || "Frequently Asked Questions About Packaging";

  return (
    <section className="bg-[#F7F3EC] py-10 sm:py-12 lg:py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-xl lg:text-left">
          <FaqAccentHeading text={heading} />
          {faqSubtext ? (
            <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-[#6B7280] sm:text-[15px] lg:mx-0">
              {faqSubtext}
            </p>
          ) : null}
        </div>

        <div className="mt-8 grid grid-cols-1 items-center gap-6 lg:mt-10 lg:grid-cols-2 lg:gap-10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[#EDE6DB] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[480px]">
            <Image
              src={faqImageUrl || "/images/reliable-packaging-boxes.jpg"}
              alt={
                faqImageAlt ||
                "Custom kraft packaging boxes from Packaging Hype"
              }
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          <div className="min-w-0">
            <FAQAccordion items={faqItems} variant="pills" />
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
      </Container>
    </section>
  );
}
