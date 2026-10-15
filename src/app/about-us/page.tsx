import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { QuoteCTA } from "@/components/ui/QuoteCTA";
import { Factory, Users, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Custom Packaging Manufacturer USA",
  description:
    "Learn about Packaging Hype — a premier custom packaging box manufacturer helping emerging and enterprise brands elevate retail and e-commerce unboxing.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#F6F8FA] min-h-screen py-10 sm:py-16">
      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ label: "About Packaging Hype" }]} />

        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 sm:p-12 shadow-sm space-y-8">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#eaf7f6] text-[#21AAA5] rounded-full mb-3">
              Packaging Manufacturer
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172455] tracking-tight">
              About Packaging Hype
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              At Packaging Hype, we believe exceptional packaging does more than just protect your goods — it builds lasting brand equity, tells your story, and creates memorable unboxing moments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="p-6 bg-[#F6F8FA] rounded-xl border border-gray-200">
              <Factory className="w-8 h-8 text-[#21AAA5] mb-3" />
              <h3 className="text-lg font-bold text-[#172455] mb-1">State-of-the-Art Manufacturing</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Equipped with high-precision Heidelberg offset presses, digital short-run printers, and automated die-cutters to produce consistent packaging tolerances.
              </p>
            </div>

            <div className="p-6 bg-[#F6F8FA] rounded-xl border border-gray-200">
              <Users className="w-8 h-8 text-[#21AAA5] mb-3" />
              <h3 className="text-lg font-bold text-[#172455] mb-1">Dedicated Prepress Engineering</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Our in-house packaging structural designers review your dielines, inspect resolution, and provide complimentary 3D digital mockups before printing.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-[#172455]">Our Commitments to You</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-[#21AAA5] shrink-0 mt-0.5" />
                <span><strong>Zero Hidden Setup Fees:</strong> We do not charge separate plate or die-cutting fees on custom orders.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-[#21AAA5] shrink-0 mt-0.5" />
                <span><strong>Flexible Low Minimums:</strong> Low MOQ starting at 100 units empowers early-stage startups and rapid testing.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-[#21AAA5] shrink-0 mt-0.5" />
                <span><strong>Free Doorstep Freight:</strong> 100% free ground delivery anywhere in the continental USA.</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="mt-20">
        <QuoteCTA />
      </div>
    </div>
  );
}
