import { redirect } from "next/navigation";

// 301 permanent redirect: /products/[slug] → /product/[slug]
export default async function ProductsSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/product/${slug}`);
}
