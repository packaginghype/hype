import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import {
  ShieldCheck,
  Truck,
  Clock,
  Palette,
} from "lucide-react";
import { getStaticPageData } from "@/lib/get-static-page";
import { getStaticPageDef } from "@/lib/static-pages";

export const revalidate = 120;

const KEY = "quote";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getStaticPageData(KEY);
  const def = getStaticPageDef(KEY);
  return {
    title: data?.seoTitle || def?.defaults.seoTitle || "Request a Quote",
    description: data?.seoDescription || def?.defaults.seoDescription || undefined,
    keywords: data?.seoKeywords || undefined,
  };
}

const VALUE_PROPS = [
  {
    icon: Palette,
    title: "Free 3D Digital Proofing",
    description:
      "Accurate 3D structural mockup and dieline verification before production begins.",
  },
  {
    icon: Clock,
    title: "8–10 Days Turnaround",
    description:
      "Fast commercial manufacturing timelines to keep your product launch strictly on schedule.",
  },
  {
    icon: Truck,
    title: "Free USA Delivery",
    description:
      "Doorstep freight shipping across the continental United States with zero hidden fees.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Die or Plate Fees",
    description:
      "Transparent all-inclusive manufacturing pricing with no separate tooling charges.",
  },
];


export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const cms = await getStaticPageData(KEY);
  const def = getStaticPageDef(KEY);

  return (
    <div className="min-h-screen bg-[#F6F8FA] pb-20 pt-8 sm:pb-24 sm:pt-10">
      <Container>
        <Breadcrumbs items={[{ label: "Request a Quote" }]} />

        {/* Hero Header */}
        <div className="mx-auto mt-6 max-w-3xl text-center">
          <h1 className="mt-3.5 font-heading text-3xl font-extrabold tracking-tight text-[#172455] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.18]">
            {cms?.heading || def?.defaults.heading || "Get a Free Custom Packaging Quote"}
          </h1>

          <p className="mt-3.5 text-sm leading-relaxed text-[#4B5563] sm:text-base">
            {cms?.intro ||
              def?.defaults.intro ||
              "Specify your box dimensions, preferred stock, and quantity below."}
          </p>
        </div>

        {/* Main Quote Form Section */}
        <div className="mx-auto mt-10 max-w-4xl">
          <QuoteRequestForm initialProductName={product || ""} />
        </div>

        {/* Trust Badges 4-Grid */}
        <div className="mx-auto mt-14 max-w-5xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((prop, idx) => {
              const Icon = prop.icon;
              return (
                <div
                  key={idx}
                  className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#E8F7F5] text-[#21AAA5]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3.5 text-sm font-bold text-[#172455]">
                    {prop.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#6B7280]">
                    {prop.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
