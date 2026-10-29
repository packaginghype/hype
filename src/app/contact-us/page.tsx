import { Metadata } from "next";
import { Phone, Mail, Clock, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { VERIFIED_BUSINESS_INFO } from "@/data/verified-data";
import { CmsContentPage } from "@/components/pages/CmsContentPage";
import { getStaticPageData } from "@/lib/get-static-page";
import { getStaticPageDef } from "@/lib/static-pages";

export const revalidate = 120;

const KEY = "contact-us";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getStaticPageData(KEY);
  const def = getStaticPageDef(KEY);
  return {
    title: data?.seoTitle || def?.defaults.seoTitle || "Contact Us",
    description: data?.seoDescription || def?.defaults.seoDescription || undefined,
    keywords: data?.seoKeywords || undefined,
  };
}

export default async function ContactPage() {
  const data = (await getStaticPageData(KEY))!;

  return (
    <CmsContentPage title="Contact Us" data={data}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="flex flex-col items-start rounded-xl border border-gray-200 bg-[#F6F8FA] p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf7f6] text-[#21AAA5]">
            <Phone className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Direct Phone
          </span>
          <a
            href={`tel:${VERIFIED_BUSINESS_INFO.phoneRaw}`}
            className="mt-1 text-sm font-bold text-[#172455] hover:text-[#21AAA5]"
          >
            {VERIFIED_BUSINESS_INFO.phone}
          </a>
          <span className="mt-1 text-[11px] text-gray-500">Mon - Fri, 9am - 6pm EST</span>
        </div>

        <div className="flex flex-col items-start rounded-xl border border-gray-200 bg-[#F6F8FA] p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf7f6] text-[#21AAA5]">
            <Mail className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            General Inquiry
          </span>
          <a
            href={`mailto:${VERIFIED_BUSINESS_INFO.email}`}
            className="mt-1 text-sm font-bold text-[#172455] hover:text-[#21AAA5]"
          >
            {VERIFIED_BUSINESS_INFO.email}
          </a>
          <span className="mt-1 text-[11px] text-gray-500">Replies within 1 business day</span>
        </div>

        <div className="flex flex-col items-start rounded-xl border border-gray-200 bg-[#F6F8FA] p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf7f6] text-[#21AAA5]">
            <Clock className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Turnaround
          </span>
          <span className="mt-1 text-sm font-bold text-[#172455]">
            {VERIFIED_BUSINESS_INFO.turnaround}
          </span>
          <span className="mt-1 text-[11px] text-gray-500">Free USA Ground Freight</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-6 rounded-xl bg-[#172455] p-8 text-white sm:flex-row">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white">Need a Formal Commercial Quote?</h3>
          <p className="text-xs text-slate-300">
            Use our quotation builder to input custom dimensions and upload artwork.
          </p>
        </div>
        <Button href="/quote" variant="primary" size="md" className="shrink-0">
          <SendHorizontal className="mr-1.5 h-4 w-4" />
          <span>Request Custom Quote</span>
        </Button>
      </div>
    </CmsContentPage>
  );
}
