import React from "react";
import { Phone, ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { VERIFIED_BUSINESS_INFO } from "@/data/verified-data";

export function QuoteCTA() {
  return (
    <section className="relative overflow-hidden bg-[#172455] py-16 text-white sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#21AAA5]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#FF5548]/10 blur-3xl"
      />

      <Container className="relative z-10 mx-auto max-w-4xl text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#21AAA5]">
          <Sparkles className="h-3.5 w-3.5" />
          Fast Turnaround • Zero Setup Fees
        </span>

        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready to Elevate Your Brand With Custom Packaging?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Get competitive wholesale pricing, complimentary 3D dieline proofs, and
          tailored advice from dedicated packaging specialists.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            href="/quote"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <span>Request an Instant Quote</span>
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>

          <Button
            href={`tel:${VERIFIED_BUSINESS_INFO.phoneRaw}`}
            variant="outline"
            size="lg"
            className="w-full border-white text-white hover:bg-white hover:text-[#172455] sm:w-auto"
          >
            <Phone className="mr-2 h-4 w-4" />
            <span>Call {VERIFIED_BUSINESS_INFO.phone}</span>
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-8 text-xs font-medium text-slate-300 sm:gap-10 sm:text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#21AAA5]" />
            <span>Low MOQ Starting at 100 Boxes</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-[#21AAA5]" />
            <span>Free Shipping Across the USA</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#21AAA5]" />
            <span>Complimentary 3D Digital Proofs</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
