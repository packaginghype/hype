import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { ShieldCheck, Truck, Clock, Palette } from "lucide-react";
import { VERIFIED_BUSINESS_INFO } from "@/data/verified-data";

export const metadata: Metadata = {
  title: "Request a Custom Packaging Quote",
  description:
    "Get instant wholesale manufacturing pricing on custom printed boxes, mailers, and folding cartons. Free 3D proofs and free USA delivery.",
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;

  return (
    <div className="bg-[#F6F8FA] py-10 sm:py-16">
      <Container>
        <Breadcrumbs items={[{ label: "Request a Quote" }]} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#eaf7f6] text-[#21AAA5] rounded-full">
              Custom Box Quotation
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172455] tracking-tight leading-tight">
              Get an Instant Wholesale Packaging Quote
            </h1>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Fill out your box specifications below. Our structural packaging team will review your dielines and dimensions to deliver a formal quote and complimentary 3D digital proof.
            </p>

            <div className="pt-4 space-y-4">
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-[#eaf7f6] text-[#21AAA5] flex items-center justify-center shrink-0">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#172455]">Free 3D Digital Proofing</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Receive an accurate 3D preview and dieline mockup before production commences.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-[#eaf7f6] text-[#21AAA5] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#172455]">8–10 Days Turnaround</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Fast commercial manufacturing timelines to keep your product launches on schedule.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-[#eaf7f6] text-[#21AAA5] flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#172455]">Free USA Shipping</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Doorstep freight delivery across the continental United States with zero hidden freight fees.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-[#eaf7f6] text-[#21AAA5] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#172455]">No Die or Setup Fees</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Transparent, all-inclusive pricing with zero separate die-cutting or plate setup charges.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#172455] text-white text-xs">
              <span className="font-bold block text-sm mb-1">Prefer to speak directly?</span>
              <p className="text-slate-300">Call our direct packaging line: <a href={`tel:${VERIFIED_BUSINESS_INFO.phoneRaw}`} className="text-[#21AAA5] font-bold underline">{VERIFIED_BUSINESS_INFO.phone}</a></p>
            </div>
          </div>

          {/* Right Column: Quote Form */}
          <div className="lg:col-span-7">
            <QuoteRequestForm initialProductName={product || ""} />
          </div>
        </div>
      </Container>
    </div>
  );
}
