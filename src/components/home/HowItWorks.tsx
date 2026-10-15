import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VERIFIED_WORKFLOW_STEPS } from "@/data/verified-data";

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 bg-[#172455] text-white">
      <Container>
        <SectionHeading
          badge="Seamless B2B Production"
          title="How Custom Packaging Works"
          description="From initial concept and structural dielines to press-check quality and doorstep delivery, here is our 4-step manufacturing workflow."
          align="center"
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VERIFIED_WORKFLOW_STEPS.map((step) => (
            <div
              key={step.step}
              className="relative flex flex-col p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs hover:border-[#21AAA5]/40 transition-colors"
            >
              <div className="text-4xl font-extrabold text-[#21AAA5] mb-4 font-mono">
                {step.step}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
