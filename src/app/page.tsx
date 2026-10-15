import { HeroSection } from "@/components/home/HeroSection";
import { TrustBenefitsBar } from "@/components/home/TrustBenefitsBar";
import { IndustrySolutions } from "@/components/home/IndustrySolutions";
import { AboutWhoWeAre } from "@/components/home/AboutWhoWeAre";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ReviewsSlider } from "@/components/home/ReviewsSlider";
import { ReliablePackagingSection } from "@/components/home/ReliablePackagingSection";
import { FaqSection } from "@/components/home/FaqSection";
import { BlogPreviewSection } from "@/components/home/BlogPreviewSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBenefitsBar />
      <IndustrySolutions />
      <AboutWhoWeAre />
      <FeaturedProducts />
      <CategoryShowcase />
      <ReviewsSlider />
      <ReliablePackagingSection />
      <FaqSection />
      <BlogPreviewSection />
      {/* Small quote band sits above footer via AppShell FooterQuoteCta */}
    </>
  );
}
