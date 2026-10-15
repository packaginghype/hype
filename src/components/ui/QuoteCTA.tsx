import React from "react";
import { Phone, ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { VERIFIED_BUSINESS_INFO } from "@/data/verified-data";

export function QuoteCTA() {
  return (
    <section className="bg-[#172455] text-white py-16 sm:py-20 relative overflow-hidden">
      {/* Subtle brand geometry background accent */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#21AAA5]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FF5548]/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 text-center max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 text-[#21AAA5] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Fast Turnaround • Zero Setup Fees
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Ready to Elevate Your Brand With Custom Packaging?
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Get competitive wholesale pricing, complimentary 3D dieline proofs, and tailored advice from dedicated packaging specialists.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/quote" variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-coral-500/20">
            <span>Request an Instant Quote</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>

          <Button
            href={`tel:${VERIFIED_BUSINESS_INFO.phoneRaw}`}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-[#172455]"
          >
            <Phone className="w-4 h-4 mr-2" />
            <span>Call {VERIFIED_BUSINESS_INFO.phone}</span>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#21AAA5]" />
            <span>Low MOQ Starting at 100 Boxes</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#21AAA5]" />
            <span>Free Shipping Across the USA</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#21AAA5]" />
            <span>Complimentary 3D Digital Proofs</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
