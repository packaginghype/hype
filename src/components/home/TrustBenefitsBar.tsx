import React from "react";
import { Leaf, Package, Recycle, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";

const BENEFITS = [
  { icon: Truck, label: "Free USA Shipping" },
  { icon: Recycle, label: "Recyclable Materials" },
  { icon: Leaf, label: "Eco-Friendly Options" },
  { icon: Package, label: "MOQ Starting at 100" },
  { icon: ShieldCheck, label: "Quality Guaranteed" },
] as const;

export function TrustBenefitsBar() {
  return (
    <section className="border-b border-[#E8EAEF] bg-white">
      <Container className="py-4 sm:py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:justify-between sm:gap-x-3">
          {BENEFITS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#172455] sm:text-[13px]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF7F6] text-[#21AAA5]">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
