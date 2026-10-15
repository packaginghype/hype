import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Packaging Hype",
  description: "Packaging Hype free USA delivery terms, freight palletizing, and turnaround policies.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#F6F8FA] min-h-screen py-10 sm:py-16">
      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ label: "Shipping & Delivery Policy" }]} />

        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 sm:p-12 shadow-sm space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
          <h1 className="text-3xl font-extrabold text-[#172455] tracking-tight">
            Shipping & Delivery Policy
          </h1>

          <section className="space-y-2 pt-4">
            <h2 className="text-lg font-bold text-[#172455]">1. Free USA Ground Shipping</h2>
            <p>
              Standard ground freight shipping is 100% complimentary on all custom packaging orders delivered within the contiguous United States.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-gray-100">
            <h2 className="text-lg font-bold text-[#172455]">2. Packaging and Freight Handling</h2>
            <p>
              All folding cartons, rigid boxes, and corrugated mailers are packed flat in heavy-duty corrugated master cartons and palletized with shrink wrap to protect corners and avoid transit damage.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
