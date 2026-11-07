import React from "react";
import Link from "next/link";
import { ArrowRight, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { SafeImage } from "@/components/ui/SafeImage";
import type { HomePageData } from "@/lib/home-page-schema";
import { HOME_PAGE_DEFAULTS } from "@/lib/home-page-schema";

type Props = Pick<
  HomePageData,
  | "reliableImageUrl"
  | "reliableImageAlt"
  | "reliableHeading"
  | "reliableBody"
  | "reliableBtnLabel"
  | "reliableBtnHref"
>;

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Protect your products" },
  { icon: PackageCheck, label: "Present your brand" },
  { icon: Truck, label: "Ship with confidence" },
];

export function ReliablePackagingSection({
  reliableImageUrl = HOME_PAGE_DEFAULTS.reliableImageUrl,
  reliableImageAlt = HOME_PAGE_DEFAULTS.reliableImageAlt,
  reliableHeading = HOME_PAGE_DEFAULTS.reliableHeading,
  reliableBody = HOME_PAGE_DEFAULTS.reliableBody,
  reliableBtnLabel = HOME_PAGE_DEFAULTS.reliableBtnLabel,
  reliableBtnHref = HOME_PAGE_DEFAULTS.reliableBtnHref,
}: Partial<Props> = {}) {
  return (
    <section className="relative overflow-hidden bg-[#EEF6FF] py-10 sm:py-12 lg:py-14">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">

          {/* ── Left: Content ── */}
          <div className="flex flex-col">
            {/* Section label */}
            <span className="inline-flex w-fit items-center rounded-full bg-[#172455]/8 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#172455]">
              Why Packaging Hype
            </span>

            {/* Heading */}
            {reliableHeading ? (
              <h2 className="mt-3 font-heading text-[1.85rem] font-extrabold leading-tight tracking-tight text-[#172455] sm:text-3xl lg:text-[2.2rem]">
                {reliableHeading}
              </h2>
            ) : null}

            {/* Accent bar */}
            <span
              aria-hidden
              className="mt-4 block h-[3px] w-14 rounded-full bg-[#FF5548]"
            />

            {/* Body */}
            {reliableBody ? (
              <div className="mt-4 text-[15px] leading-[1.8] text-[#4B5563] sm:text-base [&_p+p]:mt-3">
                <RichText html={reliableBody} />
              </div>
            ) : null}

            {/* Highlight pills */}
            <ul className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 rounded-[12px] border border-[#D6E4F7] bg-white px-3.5 py-3 shadow-sm"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF6FF] text-[#172455] shadow-sm">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-[12.5px] font-bold leading-snug text-[#172455]">
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            {reliableBtnLabel ? (
              <div className="mt-8">
                <Link
                  href={reliableBtnHref || "/quote"}
                  className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-[6px] bg-[#FF5548] px-7 text-sm font-bold text-white shadow-md shadow-[#FF5548]/25 transition-colors hover:bg-[#e04337]"
                >
                  {reliableBtnLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            ) : null}
          </div>

          {/* ── Right: Image ── */}
          <div className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:max-w-none">
            {/* Decorative blobs */}
            <div
              aria-hidden
              className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-[22px] bg-[#FF5548]/10 sm:block"
            />
            <div
              aria-hidden
              className="absolute -bottom-4 -left-4 hidden h-20 w-20 rounded-full bg-[#172455]/8 sm:block"
            />

            {/* Image card */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[#F3F1EE] shadow-[0_28px_60px_-28px_rgba(23,36,85,0.42)] ring-1 ring-[#172455]/6">
              <SafeImage
                src={reliableImageUrl || "/images/reliable-packaging-boxes.jpg"}
                alt={
                  reliableImageAlt ||
                  "Custom packaging boxes for growing businesses"
                }
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
