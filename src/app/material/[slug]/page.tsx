import { redirect } from "next/navigation";

// 301 Permanent redirect: /material/[slug] → /[slug]
export default async function MaterialSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/${slug}`);
}
