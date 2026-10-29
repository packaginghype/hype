import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  ArrowRight,
  Package,
  Truck,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { VERIFIED_BUSINESS_INFO } from "@/data/verified-data";

export const metadata: Metadata = {
  title: "Thank You - Quote Request Received | Packaging Hype",
  description:
    "Your custom packaging quote request has been received. Our team will contact you within 24 hours with wholesale pricing and a free 3D digital proof.",
  robots: { index: false, follow: false },
};

const NEXT_STEPS = [
  {
    step: "01",
    icon: Mail,
    title: "We received your request",
    description:
      "Your inquiry is logged with a reference number. Keep it handy if you follow up.",
  },
  {
    step: "02",
    icon: Clock,
    title: "Review within 24 hours",
    description:
      "Our packaging team reviews your specs and prepares wholesale pricing.",
  },
  {
    step: "03",
    icon: Package,
    title: "Free 3D digital proof",
    description:
      "You’ll get a complimentary 3D proof so you can visualize the box before production.",
  },
  {
    step: "04",
    icon: Truck,
    title: "8–10 day production",
    description:
      "After approval we manufacture and ship with free USA delivery — no hidden fees.",
  },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Zero Die & Plate Fees" },
  { icon: Truck, label: "Free USA Delivery" },
  { icon: Clock, label: "8–10 Day Turnaround" },
  { icon: Headphones, label: "Expert Support" },
];

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; name?: string }>;
}) {
  const { ref, name } = await searchParams;

  return (
    <div className="bg-white">
      <section className="border-b border-[#D5E8DC] bg-[#F3FAF6] py-14 sm:py-16 lg:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#21AAA5] shadow-[0_12px_28px_-16px_rgba(23,36,85,0.35)] ring-1 ring-[#D5E8DC]">
              <CheckCircle2 className="h-8 w-8" strokeWidth={2.2} />
            </span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#21AAA5]">
              Quote request received
            </p>
            <h1 className="mt-2 font-heading text-[1.85rem] font-extrabold leading-tight tracking-tight text-[#172455] sm:text-4xl">
              {name ? `Thank you, ${name}!` : "Thank you for reaching out!"}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[#4B5563] sm:text-base">
              Our packaging specialists will review your request and get back
              to you within{" "}
              <span className="font-semibold text-[#172455]">24 hours</span>{" "}
              with wholesale pricing and a free 3D digital proof.
            </p>

            {ref ? (
              <div className="mx-auto mt-7 inline-flex flex-wrap items-center justify-center gap-2 rounded-[10px] border border-[#D5E8DC] bg-white px-5 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Reference
                </span>
                <span className="text-lg font-extrabold tracking-wide text-[#FF5548]">
                  {ref}
                </span>
              </div>
            ) : null}

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-[#172455]"
                >
                  <Icon className="h-4 w-4 text-[#21AAA5]" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-[#FF5548] px-6 text-sm font-bold text-white transition-colors hover:bg-[#e04337]"
              >
                Back to homepage
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/categories"
                className="inline-flex h-12 cursor-pointer items-center justify-center rounded-[6px] border border-[#D5E8DC] bg-white px-6 text-sm font-bold text-[#172455] transition-colors hover:border-[#FF5548] hover:text-[#FF5548]"
              >
                Browse categories
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#21AAA5]">
              What happens next
            </p>
            <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl">
              Your quote journey
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#4B5563]">
              From submission to delivery — here is what to expect.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {NEXT_STEPS.map(({ step, icon: Icon, title, description }) => (
              <article
                key={step}
                className="rounded-[14px] border border-[#DCEFE4] bg-[#F8FBFA] p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#21AAA5] shadow-sm ring-1 ring-[#D5E8DC]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-[11px] font-extrabold tracking-widest text-[#C5D4CC]">
                    {step}
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#172455]">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#5B667A]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-[#FFE0DC] bg-[#FFF5F4] py-12 sm:py-14">
        <Container>
          <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-heading text-xl font-extrabold tracking-tight text-[#172455] sm:text-2xl">
                Need urgent help?
              </h2>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[#4B5563]">
                Call or email our packaging team with your reference number and
                we’ll pick it up right away.
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <a
                href={`tel:${VERIFIED_BUSINESS_INFO.phoneRaw}`}
                className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-bold text-[#172455] hover:text-[#FF5548]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#FF5548] text-white">
                  <Phone className="h-4 w-4" aria-hidden />
                </span>
                {VERIFIED_BUSINESS_INFO.phone}
              </a>
              <a
                href={`mailto:${VERIFIED_BUSINESS_INFO.email}`}
                className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-bold text-[#172455] hover:text-[#FF5548]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#21AAA5] text-white">
                  <Mail className="h-4 w-4" aria-hidden />
                </span>
                {VERIFIED_BUSINESS_INFO.email}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
