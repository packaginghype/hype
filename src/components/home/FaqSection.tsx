import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { VERIFIED_FAQS } from "@/data/verified-data";

export function FaqSection() {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
      <Container className="max-w-4xl">
        <SectionHeading
          badge="Answers to Common Questions"
          title="Frequently Asked Questions"
          description="Everything you need to know about dieline templates, material thicknesses, minimum orders, and production timelines."
          align="center"
        />

        <FAQAccordion items={VERIFIED_FAQS} />

        <div className="mt-12 text-center p-6 bg-[#F6F8FA] rounded-xl border border-[#E2E4E8]">
          <h4 className="text-base font-bold text-[#172455]">
            Have a custom specification or technical question?
          </h4>
          <p className="mt-1 text-sm text-gray-600">
            Our prepress packaging engineers are available Monday through Friday.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Link
              href="/contact-us"
              className="text-sm font-bold text-[#21AAA5] hover:text-[#172455] underline"
            >
              Contact Prepress Support →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
