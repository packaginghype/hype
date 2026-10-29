import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
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
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[#F6FAF8] lg:block"
      />
      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="relative order-1 mx-auto w-full max-w-[560px] lg:order-2 lg:mx-0 lg:max-w-none">
            <div
              aria-hidden
              className="absolute -bottom-5 -right-5 hidden h-28 w-28 rounded-[22px] bg-[#21AAA5]/15 sm:block"
            />
            <div
              aria-hidden
              className="absolute -left-4 -top-4 hidden h-20 w-20 rounded-full bg-[#FF5548]/12 sm:block"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[#F3F1EE] shadow-[0_28px_60px_-32px_rgba(23,36,85,0.5)] ring-1 ring-[#172455]/5">
              <Image
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

          <div className="order-2 max-w-xl lg:order-1 lg:max-w-none">
            {reliableHeading ? (
              <h2 className="font-heading text-[1.85rem] font-extrabold leading-tight tracking-tight text-[#172455] sm:text-3xl lg:text-[2.35rem]">
                {reliableHeading}
              </h2>
            ) : null}
            <span
              aria-hidden
              className="mt-4 block h-[3px] w-14 rounded-full bg-[#FF5548]"
            />
            {reliableBody ? (
              <div className="mt-5 space-y-3.5 text-[15px] leading-[1.8] text-[#4B5563] sm:text-base">
                <RichText html={reliableBody} />
              </div>
            ) : null}

            <ul className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 rounded-[12px] border border-[#E6EEEA] bg-[#F8FBFA] px-3.5 py-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#21AAA5] shadow-sm">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-[12.5px] font-bold leading-snug text-[#172455]">
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            {reliableBtnLabel ? (
              <Link
                href={reliableBtnHref || "/quote"}
                className="mt-8 inline-flex h-12 cursor-pointer items-center gap-2 rounded-[6px] bg-[#FF5548] px-6 text-sm font-bold text-white transition-colors hover:bg-[#e04337]"
              >
                {reliableBtnLabel}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
