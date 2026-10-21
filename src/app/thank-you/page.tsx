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
    title: "Confirmation Email Sent",
    description:
      "A confirmation with your quote reference number has been sent to your inbox. Check your spam folder if you don't see it.",
  },
  {
    step: "02",
    icon: Clock,
    title: "Review Within 24 Hours",
    description:
      "Our packaging specialists are reviewing your specifications and will prepare a formal wholesale quote tailored to your needs.",
  },
  {
    step: "03",
    icon: Package,
    title: "Free 3D Digital Proof",
    description:
      "Along with your quote, you'll receive a complimentary 3D digital proof so you can visualize your packaging before production.",
  },
  {
    step: "04",
    icon: Truck,
    title: "Fast 8-10 Day Production",
    description:
      "Once approved, we manufacture and ship your custom packaging with free USA delivery - no hidden fees.",
  },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Zero Die & Plate Fees" },
  { icon: Truck, label: "Free USA Delivery" },
  { icon: Clock, label: "8-10 Day Turnaround" },
  { icon: Headphones, label: "24/7 Expert Support" },
];

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; name?: string }>;
}) {
  const { ref, name } = await searchParams;

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#172455] via-[#1a2d6b] to-[#0f1839] py-20 sm:py-28">
        <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#FF5548]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-[#21AAA5]/10 blur-3xl" />
        <Container className="relative z-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#21AAA5]/20 ring-8 ring-[#21AAA5]/10">
            <CheckCircle2 className="h-10 w-10 text-[#21AAA5]" strokeWidth={2} />
          </div>
          <h1 className="mt-6 font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Quote Request Received!
          </h1>
          {name ? (
            <p className="mt-3 text-lg font-medium text-white/80">
              Thank you, <span className="text-[#21AAA5]">{name}</span>!
            </p>
          ) : (
            <p className="mt-3 text-lg font-medium text-white/80">Thank you for reaching out!</p>
          )}
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/60">
            Our packaging specialists will review your request and get back to you within{" "}
            <span className="font-semibold text-white/80">24 hours</span> with wholesale pricing and a free 3D digital proof.
          </p>
          {ref && (
            <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm">
              <span className="text-sm text-white/50">Your Reference Number</span>
              <span className="text-lg font-extrabold tracking-wider text-[#FF5548]">{ref}</span>
            </div>
          )}
          <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-semibold text-white/70">
                <Icon className="h-4 w-4 text-[#21AAA5]" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#21AAA5]">What Happens Next</p>
            <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-3xl">Your Quote Journey</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">Here is exactly what to expect from submission to delivery.</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {NEXT_STEPS.map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="relative rounded-[14px] border border-[#E5E7EB] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <span className="absolute right-4 top-4 text-[11px] font-extrabold tracking-widest text-[#E5E7EB]">{step}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#EAF7F6] text-[#21AAA5]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#172455]">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-[#E5E7EB] bg-white py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
              <div>
                <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#172455] sm:text-[1.75rem]">Need Urgent Assistance?</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">If you need an immediate response or have questions about your quote, our packaging experts are ready to help.</p>
                <div className="mt-6 space-y-3">
                  <a href="tel:+18884447478" className="flex items-center gap-3 text-sm font-semibold text-[#172455] transition-colors hover:text-[#FF5548]">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF7F6] text-[#21AAA5]"><Phone className="h-4 w-4" /></span>
                    +1 (888) 444-7478
                  </a>
                  <a href="mailto:info@packaginghype.com" className="flex items-center gap-3 text-sm font-semibold text-[#172455] transition-colors hover:text-[#FF5548]">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF7F6] text-[#21AAA5]"><Mail className="h-4 w-4" /></span>
                    info@packaginghype.com
                  </a>
                </div>
              </div>
              <div className="rounded-[16px] bg-gradient-to-br from-[#172455] to-[#0f1839] p-8 text-center">
                <Package className="mx-auto h-10 w-10 text-[#21AAA5]" />
                <h3 className="mt-4 text-xl font-extrabold text-white">Explore More Packaging</h3>
                <p className="mt-2 text-sm text-white/60">Browse our full range of custom packaging solutions while you wait.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link href="/categories" className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#FF5548] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#e04337]">
                    Browse Categories <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white">
                    Go to Homepage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
