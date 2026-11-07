import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { SafeImage } from "@/components/ui/SafeImage";
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

const HIGHLIGHTS = [
  "Free design support on every order",
  "Low minimums — start from 50 boxes",
  "Fast turnaround with on-time delivery",
  "Eco-friendly & sustainable materials",
];

const STATS = [
  { value: "10K+", label: "Happy Clients" },
  { value: "500+", label: "Box Styles" },
  { value: "15+", label: "Years Experience" },
  { value: "98%", label: "Satisfaction Rate" },
];

export function AboutWhoWeAre({
  aboutHeading = HOME_PAGE_DEFAULTS.aboutHeading,
  aboutBody = HOME_PAGE_DEFAULTS.aboutBody,
  aboutBtnLabel = HOME_PAGE_DEFAULTS.aboutBtnLabel,
  aboutBtnHref = HOME_PAGE_DEFAULTS.aboutBtnHref,
  aboutImageUrl = HOME_PAGE_DEFAULTS.aboutImageUrl,
  aboutImageAlt = HOME_PAGE_DEFAULTS.aboutImageAlt,
}: Partial<Props> = {}) {
  return (
    <section className="bg-white py-10 sm:py-12 lg:py-14">
      <Container>
        {/* Main two-column layout */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* ── Left: Image ── */}
          <div className="relative">
            {/* Decorative blobs */}
            <div
              aria-hidden
              className="absolute -left-4 -top-4 hidden h-28 w-28 rounded-[22px] bg-[#FF5548]/10 sm:block"
            />
            <div
              aria-hidden
              className="absolute -bottom-4 -right-4 hidden h-24 w-24 rounded-full bg-[#EEF6FF] sm:block"
            />

            {/* Image card */}
            <div className="relative aspect-[5/4] overflow-hidden rounded-[20px] bg-[#F3F1EE] shadow-[0_28px_60px_-24px_rgba(23,36,85,0.40)] ring-1 ring-[#172455]/6 lg:aspect-[4/3]">
              <SafeImage
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

            {/* Stats bar overlapping bottom of image */}
            <div className="relative mt-5 grid grid-cols-4 gap-2 rounded-[14px] border border-[#E5E9F4] bg-white p-4 shadow-[0_8px_24px_-10px_rgba(23,36,85,0.18)] sm:mt-6 sm:p-5">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-xl font-extrabold tracking-tight text-[#172455] sm:text-2xl">
                    {value}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium leading-snug text-gray-500 sm:text-xs">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Content ── */}
          <div className="flex flex-col">
            {/* Heading */}
            {aboutHeading ? (
              <h2 className="font-heading text-[1.85rem] font-extrabold leading-tight tracking-tight text-[#172455] sm:text-3xl lg:text-[2.2rem]">
                {aboutHeading}
              </h2>
            ) : null}

            {/* Accent bar */}
            <span
              aria-hidden
              className="mt-4 block h-[3px] w-14 rounded-full bg-[#FF5548]"
            />

            {/* Body text */}
            {aboutBody ? (
              <div className="mt-4 text-[15px] leading-[1.8] text-[#4B5563] sm:text-base [&_p+p]:mt-3">
                <RichText html={aboutBody} />
              </div>
            ) : null}

            {/* Highlights checklist */}
            <ul className="mt-6 space-y-2.5">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#21AAA5]"
                    aria-hidden
                  />
                  <span className="text-[14px] font-medium text-[#374151]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-8">
              <Link
                href={aboutBtnHref || "/about-us"}
                className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-[6px] bg-[#FF5548] px-7 text-sm font-bold text-white shadow-md shadow-[#FF5548]/25 transition-colors hover:bg-[#e04337]"
              >
                {aboutBtnLabel && aboutBtnLabel !== "Learn More About Us"
                  ? aboutBtnLabel
                  : "About Us"}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
