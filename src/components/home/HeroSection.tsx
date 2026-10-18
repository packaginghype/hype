import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { HomePageData } from "@/lib/home-page-schema";
import { HOME_PAGE_DEFAULTS } from "@/lib/home-page-schema";

type Props = Pick<
  HomePageData,
  "heroHeading" | "heroHighlight" | "heroSubtext" | "heroBtnLabel" | "heroBtnHref" | "heroImageUrl" | "heroImageAlt"
>;

export function HeroSection({
  heroHeading = HOME_PAGE_DEFAULTS.heroHeading,
  heroHighlight = HOME_PAGE_DEFAULTS.heroHighlight,
  heroSubtext = HOME_PAGE_DEFAULTS.heroSubtext,
  heroBtnLabel = HOME_PAGE_DEFAULTS.heroBtnLabel,
  heroBtnHref = HOME_PAGE_DEFAULTS.heroBtnHref,
  heroImageUrl = HOME_PAGE_DEFAULTS.heroImageUrl,
  heroImageAlt = HOME_PAGE_DEFAULTS.heroImageAlt,
}: Partial<Props> = {}) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative isolate overflow-hidden bg-[#D8EDE3] rounded-br-[3rem] sm:rounded-br-[4.5rem] lg:rounded-br-[6rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_20%,rgba(255,255,255,0.55),transparent_55%),radial-gradient(ellipse_50%_45%_at_90%_70%,rgba(255,85,72,0.12),transparent_60%),linear-gradient(160deg,#E4F4EB_0%,#D8EDE3_45%,#C9E4D4_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#FF5548]/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -bottom-20 h-64 w-64 rounded-full bg-white/40 blur-2xl"
        />

        <Container className="relative py-5 sm:py-6 lg:py-7 xl:py-8">
          <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-12 lg:gap-6">
            <div className="flex flex-col items-start text-left lg:col-span-6 xl:col-span-5">
              <h1 className="font-heading text-[2rem] font-extrabold leading-[1.12] tracking-tight text-[#0B1220] sm:text-4xl lg:text-[2.75rem] xl:text-5xl">
                {heroHeading}{" "}
                <span className="text-[#FF5548]">{heroHighlight}</span>
              </h1>

              {heroSubtext && (
                <p className="mt-3 max-w-xl text-base leading-relaxed text-[#1F2A37]/80 sm:mt-4 sm:text-lg">
                  {heroSubtext}
                </p>
              )}

              <div className="mt-5 sm:mt-6">
                <Button href={heroBtnHref || "/quote"} variant="primary" size="lg">
                  <span>{heroBtnLabel || "Get Free Quote"}</span>
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative lg:col-span-6 xl:col-span-7">
              <div className="relative mx-auto aspect-[5/4] w-full max-w-xl lg:aspect-[16/11] lg:max-w-none">
                <div
                  aria-hidden
                  className="absolute inset-x-[10%] bottom-[4%] h-[16%] rounded-[50%] bg-[#0B1220]/10 blur-2xl"
                />
                <Image
                  src={heroImageUrl || "/images/hero-brands-collage.webp"}
                  alt={heroImageAlt || "Custom branded packaging boxes"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain object-center drop-shadow-[0_28px_40px_rgba(11,18,32,0.18)]"
                  priority
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
