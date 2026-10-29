import { Metadata } from "next";
import { QuoteCTA } from "@/components/ui/QuoteCTA";
import { CmsContentPage } from "@/components/pages/CmsContentPage";
import { getStaticPageData } from "@/lib/get-static-page";
import { getStaticPageDef } from "@/lib/static-pages";

export const revalidate = 120;

const KEY = "about-us";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getStaticPageData(KEY);
  const def = getStaticPageDef(KEY);
  return {
    title: data?.seoTitle || def?.defaults.seoTitle || "About Us",
    description: data?.seoDescription || def?.defaults.seoDescription || undefined,
    keywords: data?.seoKeywords || undefined,
  };
}

export default async function AboutPage() {
  const data = (await getStaticPageData(KEY))!;
  return (
    <>
      <CmsContentPage title="About Us" data={data} />
      <div className="bg-[#F6F8FA] pb-10">
        <QuoteCTA />
      </div>
    </>
  );
}
