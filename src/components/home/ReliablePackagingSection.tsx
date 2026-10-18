import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import type { HomePageData } from "@/lib/home-page-schema";
import { HOME_PAGE_DEFAULTS } from "@/lib/home-page-schema";

type Props = Pick<HomePageData, "reliableImageUrl" | "reliableImageAlt" | "reliableHeading" | "reliableBody">;

export function ReliablePackagingSection({
  reliableImageUrl = HOME_PAGE_DEFAULTS.reliableImageUrl,
  reliableImageAlt = HOME_PAGE_DEFAULTS.reliableImageAlt,
  reliableHeading = HOME_PAGE_DEFAULTS.reliableHeading,
  reliableBody = HOME_PAGE_DEFAULTS.reliableBody,
}: Partial<Props> = {}) {
  return (
    <section className="py-14 sm:py-18 lg:py-20 bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:h-[500px] xl:h-[540px]">
          <div className="relative aspect-[5/4] lg:aspect-auto lg:h-full min-h-0 overflow-hidden rounded-[16px] bg-[#F3F1EE]">
            <Image
              src={reliableImageUrl || "/images/reliable-packaging-boxes.jpg"}
              alt={reliableImageAlt || "Custom packaging boxes for growing businesses"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              priority={false}
            />
          </div>

          <div className="h-[420px] sm:h-[460px] lg:h-full min-h-0 overflow-y-auto pr-3 reliable-scroll">
            {reliableHeading && (
              <h2 className="text-[1.65rem] sm:text-[1.85rem] lg:text-[2rem] font-semibold tracking-tight text-[#172455] leading-snug">
                {reliableHeading}
              </h2>
            )}
            {reliableBody && (
              <div className="mt-5 space-y-4 text-[15px] sm:text-base text-[#555555] leading-[1.7]">
                <RichText html={reliableBody} />
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
