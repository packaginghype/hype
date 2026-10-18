import { HeroSection } from "@/components/home/HeroSection";
import { TrustBenefitsBar } from "@/components/home/TrustBenefitsBar";
import { IndustrySolutions } from "@/components/home/IndustrySolutions";
import { AboutWhoWeAre } from "@/components/home/AboutWhoWeAre";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ReviewsSlider } from "@/components/home/ReviewsSlider";
import { ReliablePackagingSection } from "@/components/home/ReliablePackagingSection";
import { HomeInquirySection } from "@/components/home/HomeInquirySection";
import { FaqSection } from "@/components/home/FaqSection";
import { BlogPreviewSection } from "@/components/home/BlogPreviewSection";
import { getHomePageData } from "@/lib/get-home-page-data";
import type { Metadata } from "next";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePageData();
  return {
    title: data.seoTitle || "Custom Packaging Boxes | Packaging Hype",
    description: data.seoDescription || "Premium custom packaging boxes — tailored sizes, free USA shipping, 8-10 day turnaround.",
    keywords: data.seoKeywords || undefined,
  };
}

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <>
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
      <IndustrySolutions />
      <AboutWhoWeAre
        aboutEyebrow={data.aboutEyebrow}
        aboutHeading={data.aboutHeading}
        aboutBody={data.aboutBody}
        aboutBtnLabel={data.aboutBtnLabel}
        aboutBtnHref={data.aboutBtnHref}
        aboutImageUrl={data.aboutImageUrl}
        aboutImageAlt={data.aboutImageAlt}
      />
      <FeaturedProducts />
      <CategoryShowcase />
      <ReviewsSlider />
      <ReliablePackagingSection
        reliableImageUrl={data.reliableImageUrl}
        reliableImageAlt={data.reliableImageAlt}
        reliableHeading={data.reliableHeading}
        reliableBody={data.reliableBody}
      />
      <HomeInquirySection
        inquiryHeading={data.inquiryHeading}
        inquirySubtext={data.inquirySubtext}
      />
      <FaqSection
        faqEyebrow={data.faqEyebrow}
        faqHeading={data.faqHeading}
        faqSubtext={data.faqSubtext}
        faqImageUrl={data.faqImageUrl}
        faqImageAlt={data.faqImageAlt}
        faqs={data.faqs}
      />
      <BlogPreviewSection />
      {/* Small quote band sits above footer via AppShell FooterQuoteCta */}
    </>
  );
}
