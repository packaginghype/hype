import { HeroSection } from "@/components/home/HeroSection";
import { TrustBenefitsBar } from "@/components/home/TrustBenefitsBar";
import { IndustrySolutions } from "@/components/home/IndustrySolutions";
import { AboutWhoWeAre } from "@/components/home/AboutWhoWeAre";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ReviewsSlider } from "@/components/home/ReviewsSlider";
import { ReliablePackagingSection } from "@/components/home/ReliablePackagingSection";
import { HomeInquirySection } from "@/components/home/HomeInquirySection";
import { HomeSeoContent } from "@/components/home/HomeSeoContent";
import { FaqSection } from "@/components/home/FaqSection";
import { BlogPreviewSection } from "@/components/home/BlogPreviewSection";
import { getHomePageData } from "@/lib/get-home-page-data";
import { getPublishedCustomerReviews } from "@/lib/customer-reviews";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { HOME_PAGE_CANONICAL_DEFAULT } from "@/lib/home-page-schema";
import type { Metadata } from "next";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePageData();
  const canonical =
    (data.seoCanonical || "").trim() || HOME_PAGE_CANONICAL_DEFAULT;
  return {
    title: data.seoTitle || "Custom Packaging Boxes",
    description: data.seoDescription || "Premium custom packaging boxes — tailored sizes, free USA shipping, 8-10 day turnaround.",
    keywords: data.seoKeywords || undefined,
    alternates: {
      canonical,
    },
  };
}

export default async function HomePage() {
  const [data, reviews] = await Promise.all([
    getHomePageData(),
    getPublishedCustomerReviews(),
  ]);

  return (
    <>
      <JsonLdScript source={data.seoScript} />
      <HeroSection
        heroHeading={data.heroHeading}
        heroHighlight={data.heroHighlight}
        heroSubtext={data.heroSubtext}
        heroBtnLabel={data.heroBtnLabel}
        heroBtnHref={data.heroBtnHref}
        heroImageUrl={data.heroImageUrl}
        heroImageAlt={data.heroImageAlt}
      />
      <TrustBenefitsBar />
      <IndustrySolutions
        industryHeading={data.industryHeading}
        industrySubtext={data.industrySubtext}
      />
      <FeaturedProducts
        trendingHeading={data.trendingHeading}
        trendingSubtext={data.trendingSubtext}
        trendingProductIds={data.trendingProductIds}
      />
      <CategoryShowcase />
      <AboutWhoWeAre
        aboutHeading={data.aboutHeading}
        aboutBody={data.aboutBody}
        aboutBtnLabel={data.aboutBtnLabel}
        aboutBtnHref={data.aboutBtnHref}
        aboutImageUrl={data.aboutImageUrl}
        aboutImageAlt={data.aboutImageAlt}
      />
      <ReliablePackagingSection
        reliableImageUrl={data.reliableImageUrl}
        reliableImageAlt={data.reliableImageAlt}
        reliableHeading={data.reliableHeading}
        reliableBody={data.reliableBody}
        reliableBtnLabel={data.reliableBtnLabel}
        reliableBtnHref={data.reliableBtnHref}
      />
      <ReviewsSlider
        reviewsEyebrow={data.reviewsEyebrow}
        reviewsHeading={data.reviewsHeading}
        reviewsSubtext={data.reviewsSubtext}
        reviews={reviews}
      />
      <HomeInquirySection
        inquiryHeading={data.inquiryHeading}
        inquirySubtext={data.inquirySubtext}
      />
      <HomeSeoContent
        seoContentHeading={data.seoContentHeading}
        seoContentHtml={data.seoContentHtml}
        seoContentImageUrl={data.seoContentImageUrl}
        seoContentImageAlt={data.seoContentImageAlt}
      />
      <FaqSection
        faqHeading={data.faqHeading}
        faqSubtext={data.faqSubtext}
        faqImageUrl={data.faqImageUrl}
        faqImageAlt={data.faqImageAlt}
        faqs={data.faqs}
      />
      <BlogPreviewSection
        blogsHeading={data.blogsHeading}
        blogsSubtext={data.blogsSubtext}
        blogIds={data.blogIds}
      />
      {/* Small quote band sits above footer via AppShell FooterQuoteCta */}
    </>
  );
}
