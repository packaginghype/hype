import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RichText } from "@/components/ui/RichText";
import { PageWidgets } from "@/components/pages/PageWidgets";
import {
  cardInlineStyle,
  cardRadiusClass,
  cardShadowClass,
  contentWidthClass,
  isDarkPageBg,
  pageBgClass,
  pageBgInlineStyle,
  parsePageLayout,
  sectionGapClass,
} from "@/lib/page-layout";
import { parsePageWidgets, type PageWidget } from "@/lib/page-widgets";
import { cn } from "@/lib/utils";

export function CustomPageView({
  title,
  eyebrow,
  heading,
  intro,
  content,
  sections,
  layout,
}: {
  title: string;
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  content?: string | null;
  sections?: unknown;
  layout?: unknown;
}) {
  const widgets: PageWidget[] = parsePageWidgets(sections);
  const pageLayout = parsePageLayout(layout);
  const hasWidgets = widgets.length > 0;
  const displayHeading = heading || title;
  const showHero = pageLayout.heroStyle !== "hidden";
  const navyPage = isDarkPageBg(pageLayout);

  const heroBanner =
    pageLayout.heroStyle === "banner" || pageLayout.heroStyle === "navy";
  const heroInCard = pageLayout.heroStyle === "card";
  const heroMinimal = pageLayout.heroStyle === "minimal";

  const heroBlock = showHero ? (
    <div
      className={cn(
        "space-y-4",
        pageLayout.heroAlign === "center" && "text-center"
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
            pageLayout.heroStyle === "navy"
              ? "bg-white/10 text-[#21AAA5]"
              : "bg-[#eaf7f6] text-[#21AAA5]"
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h1
        className={cn(
          "text-3xl font-extrabold tracking-tight sm:text-4xl",
          pageLayout.heroStyle === "navy" || navyPage
            ? "text-white"
            : "text-[#172455]"
        )}
      >
        {displayHeading}
      </h1>
      {intro ? (
        <p
          className={cn(
            "max-w-3xl text-base leading-relaxed sm:text-lg",
            pageLayout.heroAlign === "center" && "mx-auto",
            pageLayout.heroStyle === "navy" || navyPage
              ? "text-white/80"
              : "text-gray-600"
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  ) : null;

  const cardClass = cn(
    "mt-8 border p-6 sm:p-10 lg:p-12",
    cardRadiusClass(pageLayout.cardRadius),
    cardShadowClass(pageLayout.cardShadow),
    sectionGapClass(pageLayout.sectionGap),
    navyPage && !pageLayout.cardBgColor
      ? "border-white/10 bg-white/5"
      : "border-gray-200 bg-white"
  );

  return (
    <div
      className={cn(
        "min-h-screen py-10 sm:py-16",
        pageBgClass(pageLayout.pageBg)
      )}
      style={pageBgInlineStyle(pageLayout)}
    >
      <Container className={contentWidthClass(pageLayout.contentWidth)}>
        {pageLayout.showBreadcrumbs ? (
          <div
            className={
              navyPage ? "[&_a]:text-white/70 [&_span]:text-white/90" : ""
            }
          >
            <Breadcrumbs items={[{ label: displayHeading }]} />
          </div>
        ) : null}

        {heroBanner && showHero ? (
          <div
            className={cn(
              "mt-6 overflow-hidden px-6 py-8 sm:px-10 sm:py-12",
              cardRadiusClass(pageLayout.cardRadius),
              pageLayout.heroStyle === "navy"
                ? "bg-[#0f1839] text-white"
                : "bg-[#E8F5F2] text-[#172455]"
            )}
          >
            {heroBlock}
          </div>
        ) : null}

        {pageLayout.showCard ? (
          <div className={cardClass} style={cardInlineStyle(pageLayout)}>
            {(heroInCard || heroMinimal) && showHero ? heroBlock : null}

            {hasWidgets ? (
              <div
                className={cn(
                  (heroInCard || heroMinimal) && showHero
                    ? "border-t border-gray-100 pt-8"
                    : ""
                )}
              >
                <PageWidgets
                  widgets={widgets}
                  className={sectionGapClass(pageLayout.sectionGap)}
                />
              </div>
            ) : content ? (
              <div className="border-t border-gray-100 pt-6">
                <RichText html={content} />
              </div>
            ) : null}
          </div>
        ) : (
          <div className={cn("mt-8", sectionGapClass(pageLayout.sectionGap))}>
            {(heroMinimal || heroInCard) && showHero ? heroBlock : null}
            {hasWidgets ? (
              <PageWidgets
                widgets={widgets}
                className={sectionGapClass(pageLayout.sectionGap)}
              />
            ) : content ? (
              <RichText html={content} />
            ) : null}
          </div>
        )}
      </Container>
    </div>
  );
}
