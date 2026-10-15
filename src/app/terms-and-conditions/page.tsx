import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms & Conditions | Packaging Hype",
  description: "Packaging Hype standard terms and conditions for custom box manufacturing, proof approval, and commercial orders.",
};

export default function TermsPage() {
  return (
    <div className="bg-[#F6F8FA] min-h-screen py-10 sm:py-16">
      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ label: "Terms & Conditions" }]} />

        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 sm:p-12 shadow-sm space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
          <h1 className="text-3xl font-extrabold text-[#172455] tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-gray-500">Effective Date: October 2026</p>

          <section className="space-y-2 pt-4">
            <h2 className="text-lg font-bold text-[#172455]">1. Proof Approval and Production</h2>
            <p>
              All custom packaging manufacturing begins only after the client provides written sign-off or digital approval on the final 2D dieline proof and 3D digital rendering. Packaging Hype is not liable for errors in spelling, graphics placement, or sizing once a proof has been approved.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-gray-100">
            <h2 className="text-lg font-bold text-[#172455]">2. Color Matching & Print Tolerances</h2>
            <p>
              Due to variations between computer monitor color spaces (RGB) and commercial printing presses (CMYK / Pantone spot colors), minor color shifts are standard in paperboard printing. Critical color matches must specify exact Pantone (PMS) formulas.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-gray-100">
            <h2 className="text-lg font-bold text-[#172455]">3. Order Quantities & Tolerances</h2>
            <p>
              Standard commercial manufacturing tolerances may include a ±5% over-run or under-run variance due to setup sheets and die-cutting calibration.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
