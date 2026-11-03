import { redirect } from "next/navigation";

// 301 Permanent redirect: /categories/[slug] → /[slug]
export default async function CategoriesSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/${slug}`);
}
