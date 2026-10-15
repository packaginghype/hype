import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Refund & Return Policy | Packaging Hype",
  description: "Packaging Hype custom manufacturing defect inspection, reprints, and refund policy.",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-[#F6F8FA] min-h-screen py-10 sm:py-16">
      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ label: "Refund & Return Policy" }]} />

        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 sm:p-12 shadow-sm space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
          <h1 className="text-3xl font-extrabold text-[#172455] tracking-tight">
            Refund & Return Policy
          </h1>

          <section className="space-y-2 pt-4">
            <h2 className="text-lg font-bold text-[#172455]">1. Custom Manufactured Goods</h2>
            <p>
              Because each packaging order is custom printed, die-cut, and manufactured to individual client specifications, orders cannot be returned for buyer remorse or resale.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-gray-100">
            <h2 className="text-lg font-bold text-[#172455]">2. Manufacturing Defect Guarantee</h2>
            <p>
              If your received packaging exhibits manufacturing defects or deviates substantially from your approved digital proof, contact our quality assurance team within 7 business days of delivery. Upon verification, Packaging Hype will reprint the defective units at zero cost.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
