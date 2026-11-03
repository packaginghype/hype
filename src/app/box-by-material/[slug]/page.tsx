import { redirect } from "next/navigation";

// 301 Permanent redirect: /box-by-material/[slug] → /[slug]
export default async function BoxByMaterialSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/${slug}`);
}
