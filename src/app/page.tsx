import { HeroSection } from "@/components/home/HeroSection";
import { ReliablePackagingSection } from "@/components/home/ReliablePackagingSection";
import { IndustrySolutions } from "@/components/home/IndustrySolutions";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FaqSection } from "@/components/home/FaqSection";
import { QuoteCTA } from "@/components/ui/QuoteCTA";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Banner */}
      <HeroSection />

      {/* 2. Industry solutions carousel */}
      <IndustrySolutions />

      {/* 3. Brand reliability story */}
      <ReliablePackagingSection />

      {/* 3. B2B Manufacturing Value Propositions */}
      <WhyChooseUs />

      {/* 4. Verified Featured Products */}
      <FeaturedProducts />

      {/* 5. 4-Step Packaging Workflow */}
      <HowItWorks />

      {/* 6. Frequently Asked Questions */}
      <FaqSection />

      {/* 7. High-Converting Quote Request CTA */}
      <QuoteCTA />
    </>
  );
}
