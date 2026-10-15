import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy | Packaging Hype",
  description: "Packaging Hype privacy policy detailing how your commercial information and uploaded dieline artwork are protected.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#F6F8FA] min-h-screen py-10 sm:py-16">
      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 sm:p-12 shadow-sm space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
          <h1 className="text-3xl font-extrabold text-[#172455] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500">Effective Date: October 2026</p>

          <section className="space-y-2 pt-4">
            <h2 className="text-lg font-bold text-[#172455]">1. Collection of Commercial Information</h2>
            <p>
              We collect information provided directly through quote requests, including contact names, company details, email addresses, phone numbers, and custom packaging specifications.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-gray-100">
            <h2 className="text-lg font-bold text-[#172455]">2. Artwork Confidentiality & Security</h2>
            <p>
              Your proprietary brand assets, logos, and vector dieline designs submitted for quoting or manufacturing are treated with strict confidentiality. We do not sell, rent, or share your proprietary design files with third-party marketers.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
