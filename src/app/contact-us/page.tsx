import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Phone, Mail, Clock, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { VERIFIED_BUSINESS_INFO } from "@/data/verified-data";

export const metadata: Metadata = {
  title: "Contact Us | Packaging Hype Support",
  description:
    "Contact Packaging Hype for custom box orders, dieline templates, and prepress support. Phone: +1(332) 252 9988 | Email: info@packaginghype.com",
};

export default function ContactPage() {
  return (
    <div className="bg-[#F6F8FA] min-h-screen py-10 sm:py-16">
      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ label: "Contact Us" }]} />

        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 sm:p-12 shadow-sm space-y-8">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#eaf7f6] text-[#21AAA5] rounded-full mb-3">
              Direct Prepress & Sales
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172455] tracking-tight">
              Get in Touch with Our Team
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              Have questions about box dimensions, printing plates, paperboard stocks, or custom dielines? Contact our dedicated packaging engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-6 bg-[#F6F8FA] rounded-xl border border-gray-200 flex flex-col items-start">
              <div className="w-10 h-10 rounded-lg bg-[#eaf7f6] text-[#21AAA5] flex items-center justify-center mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Direct Phone</span>
              <a
                href={`tel:${VERIFIED_BUSINESS_INFO.phoneRaw}`}
                className="mt-1 text-sm font-bold text-[#172455] hover:text-[#21AAA5]"
              >
                {VERIFIED_BUSINESS_INFO.phone}
              </a>
              <span className="text-[11px] text-gray-500 mt-1">Mon - Fri, 9am - 6pm EST</span>
            </div>

            <div className="p-6 bg-[#F6F8FA] rounded-xl border border-gray-200 flex flex-col items-start">
              <div className="w-10 h-10 rounded-lg bg-[#eaf7f6] text-[#21AAA5] flex items-center justify-center mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">General Inquiry</span>
              <a
                href={`mailto:${VERIFIED_BUSINESS_INFO.email}`}
                className="mt-1 text-sm font-bold text-[#172455] hover:text-[#21AAA5]"
              >
                {VERIFIED_BUSINESS_INFO.email}
              </a>
              <span className="text-[11px] text-gray-500 mt-1">Replies within 1 business day</span>
            </div>

            <div className="p-6 bg-[#F6F8FA] rounded-xl border border-gray-200 flex flex-col items-start">
              <div className="w-10 h-10 rounded-lg bg-[#eaf7f6] text-[#21AAA5] flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Turnaround</span>
              <span className="mt-1 text-sm font-bold text-[#172455]">
                {VERIFIED_BUSINESS_INFO.turnaround}
              </span>
              <span className="text-[11px] text-gray-500 mt-1">Free USA Ground Freight</span>
            </div>
          </div>

          <div className="p-8 bg-[#172455] text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-white">Need a Formal Commercial Quote?</h3>
              <p className="text-xs text-slate-300">
                Use our interactive quotation builder to input custom dimensions and upload artwork.
              </p>
            </div>
            <Button href="/quote" variant="primary" size="md" className="shrink-0">
              <SendHorizontal className="w-4 h-4 mr-1.5" />
              <span>Request Custom Quote</span>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
