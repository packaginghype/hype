import { Metadata } from "next";
import { CmsContentPage } from "@/components/pages/CmsContentPage";
import { getStaticPageData } from "@/lib/get-static-page";
import { getStaticPageDef } from "@/lib/static-pages";

export const revalidate = 120;

const KEY = "shipping-delivery-policy";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getStaticPageData(KEY);
  const def = getStaticPageDef(KEY);
  return {
    title: data?.seoTitle || def?.defaults.seoTitle || "Shipping & Delivery Policy",
    description: data?.seoDescription || def?.defaults.seoDescription || undefined,
    keywords: data?.seoKeywords || undefined,
  };
}

export default async function ShippingPolicyPage() {
  const data = (await getStaticPageData(KEY))!;
  return <CmsContentPage title="Shipping & Delivery Policy" data={data} />;
}
