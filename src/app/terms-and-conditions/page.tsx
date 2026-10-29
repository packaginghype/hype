import { Metadata } from "next";
import { CmsContentPage } from "@/components/pages/CmsContentPage";
import { getStaticPageData } from "@/lib/get-static-page";
import { getStaticPageDef } from "@/lib/static-pages";

export const revalidate = 120;

const KEY = "terms-and-conditions";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getStaticPageData(KEY);
  const def = getStaticPageDef(KEY);
  return {
    title: data?.seoTitle || def?.defaults.seoTitle || "Terms & Conditions",
    description: data?.seoDescription || def?.defaults.seoDescription || undefined,
    keywords: data?.seoKeywords || undefined,
  };
}

export default async function TermsPage() {
  const data = (await getStaticPageData(KEY))!;
  return <CmsContentPage title="Terms & Conditions" data={data} />;
}
