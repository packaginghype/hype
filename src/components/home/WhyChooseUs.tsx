import React from "react";
import {
  Palette,
  Layers,
  Clock,
  Truck,
  ShieldCheck,
  Leaf,
  LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VERIFIED_VALUE_PROPS } from "@/data/verified-data";

// Map string icon names to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  Palette,
  Layers,
  Clock,
  Truck,
  ShieldCheck,
  Leaf,
};

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 bg-[#F6F8FA] border-t border-b border-gray-200/80">
      <Container>
        <SectionHeading
          badge="Manufacturing Excellence"
          title="Why Leading Brands Choose PackagingHype"
          description="We combine precision paperboard engineering, high-volume manufacturing capabilities, and dedicated design assistance to streamline your packaging supply chain."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VERIFIED_VALUE_PROPS.map((prop, idx) => {
            const IconComponent = iconMap[prop.iconName] || ShieldCheck;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl border border-[#E2E4E8] card-hover-effect flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-lg bg-[#eaf7f6] text-[#21AAA5] flex items-center justify-center mb-5 shrink-0">
                  <IconComponent className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="text-lg font-bold text-[#172455] mb-2">
                  {prop.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
