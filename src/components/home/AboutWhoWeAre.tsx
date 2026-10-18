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
  "aboutEyebrow" | "aboutHeading" | "aboutBody" | "aboutBtnLabel" | "aboutBtnHref" | "aboutImageUrl" | "aboutImageAlt"
>;

export function AboutWhoWeAre({
  aboutEyebrow = HOME_PAGE_DEFAULTS.aboutEyebrow,
  aboutHeading = HOME_PAGE_DEFAULTS.aboutHeading,
  aboutBody = HOME_PAGE_DEFAULTS.aboutBody,
  aboutBtnLabel = HOME_PAGE_DEFAULTS.aboutBtnLabel,
  aboutBtnHref = HOME_PAGE_DEFAULTS.aboutBtnHref,
  aboutImageUrl = HOME_PAGE_DEFAULTS.aboutImageUrl,
  aboutImageAlt = HOME_PAGE_DEFAULTS.aboutImageAlt,
}: Partial<Props> = {}) {
  return (
    <section className="bg-[#F6F8FA] py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[5/4] overflow-hidden bg-[#E8F0EC] lg:aspect-[4/3]">
            <Image
              src={aboutImageUrl || "/images/reliable-packaging-boxes.jpg"}
              alt={aboutImageAlt || "Packaging Hype custom packaging team and production"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div>
            {aboutEyebrow && (
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#21AAA5]">
                {aboutEyebrow}
              </p>
            )}
            {aboutHeading && (
              <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl lg:text-[2.15rem]">
                {aboutHeading}
              </h2>
            )}
            {aboutBody && (
              <div className="mt-4 space-y-3.5 text-[14.5px] leading-[1.7] text-[#555] sm:text-[15px]">
                <RichText html={aboutBody} />
              </div>
            )}
            <Link
              href={aboutBtnHref || "/about-us"}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-[5px] bg-[#172455] px-5 text-[13.5px] font-bold text-white transition-colors hover:bg-[#0f1839]"
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
