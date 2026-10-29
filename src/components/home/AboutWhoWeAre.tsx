import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import type { HomePageData } from "@/lib/home-page-schema";
import { HOME_PAGE_DEFAULTS } from "@/lib/home-page-schema";

type Props = Pick<
  HomePageData,
  | "aboutHeading"
  | "aboutBody"
  | "aboutBtnLabel"
  | "aboutBtnHref"
  | "aboutImageUrl"
  | "aboutImageAlt"
>;

export function AboutWhoWeAre({
  aboutHeading = HOME_PAGE_DEFAULTS.aboutHeading,
  aboutBody = HOME_PAGE_DEFAULTS.aboutBody,
  aboutBtnLabel = HOME_PAGE_DEFAULTS.aboutBtnLabel,
  aboutBtnHref = HOME_PAGE_DEFAULTS.aboutBtnHref,
  aboutImageUrl = HOME_PAGE_DEFAULTS.aboutImageUrl,
  aboutImageAlt = HOME_PAGE_DEFAULTS.aboutImageAlt,
}: Partial<Props> = {}) {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -left-3 -top-3 hidden h-24 w-24 rounded-[18px] bg-[#FF5548]/15 sm:block"
            />
            <div
              aria-hidden
              className="absolute -bottom-4 -right-4 hidden h-28 w-28 rounded-full bg-[#EAF7F6] sm:block"
            />
            <div className="relative aspect-[5/4] overflow-hidden rounded-[18px] bg-[#F3F1EE] shadow-[0_24px_50px_-28px_rgba(23,36,85,0.45)] lg:aspect-[4/3]">
              <Image
                src={aboutImageUrl || "/images/reliable-packaging-boxes.jpg"}
                alt={
                  aboutImageAlt ||
                  "Packaging Hype custom packaging team and production"
                }
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="max-w-xl">
            {aboutHeading ? (
              <h2 className="font-heading text-[1.85rem] font-extrabold leading-tight tracking-tight text-[#172455] sm:text-3xl lg:text-[2.35rem]">
                {aboutHeading}
              </h2>
            ) : null}
            <span
              aria-hidden
              className="mt-4 block h-[3px] w-14 rounded-full bg-[#FF5548]"
            />
            {aboutBody ? (
              <div className="mt-5 space-y-3.5 text-[15px] leading-[1.75] text-[#4B5563] sm:text-base">
                <RichText html={aboutBody} />
              </div>
            ) : null}
            <Link
              href={aboutBtnHref || "/about-us"}
              className="mt-7 inline-flex h-12 cursor-pointer items-center gap-2 rounded-[6px] bg-[#FF5548] px-6 text-sm font-bold text-white transition-colors hover:bg-[#e04337]"
            >
              {aboutBtnLabel || "Learn More About Us"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
