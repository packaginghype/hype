import { Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { SafeImage } from "@/components/ui/SafeImage";
import { isEmptyHtml } from "@/lib/html";
import { HOME_PAGE_DEFAULTS, type HomePageData } from "@/lib/home-page-schema";

type Props = Pick<
  HomePageData,
  "seoContentHeading" | "seoContentHtml" | "seoContentImageUrl" | "seoContentImageAlt"
>;

export function HomeSeoContent({
  seoContentHeading = HOME_PAGE_DEFAULTS.seoContentHeading,
  seoContentHtml = HOME_PAGE_DEFAULTS.seoContentHtml,
  seoContentImageUrl = HOME_PAGE_DEFAULTS.seoContentImageUrl,
  seoContentImageAlt = HOME_PAGE_DEFAULTS.seoContentImageAlt,
}: Partial<Props> = {}) {
  const heading = seoContentHeading?.trim() || "";
  const html = seoContentHtml || "";
  if (!heading && isEmptyHtml(html)) return null;

  return (
    <section className="bg-white py-10 sm:py-14 lg:py-16">
      <Container>
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8 lg:h-[500px] xl:h-[540px]">
          <div className="order-1 relative aspect-[4/3] min-h-0 overflow-hidden rounded-[16px] bg-[#F3F1EE] lg:order-2 lg:aspect-auto lg:h-full">
            {seoContentImageUrl ? (
              <SafeImage
                src={seoContentImageUrl}
                alt={seoContentImageAlt || heading || "Custom packaging boxes"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-4 sm:p-6 object-center"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300">
                <Package className="h-14 w-14" />
              </div>
            )}
          </div>

          <div className="reliable-scroll order-2 h-[420px] min-h-0 overflow-y-auto pr-3 sm:h-[460px] lg:order-1 lg:h-full">
            {heading ? (
              <h2 className="text-[1.55rem] font-semibold leading-snug tracking-tight text-[#FF5548] sm:text-[1.75rem] lg:text-[1.9rem]">
                {heading}
              </h2>
            ) : null}
            {!isEmptyHtml(html) ? (
              <div className="mt-5">
                <RichText
                  html={html}
                  className="text-[15px] leading-[1.7] text-[#555]"
                />
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
