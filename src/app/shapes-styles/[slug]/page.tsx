import { redirect } from "next/navigation";

// 301 Permanent redirect: /shapes-styles/[slug] → /[slug]
export default async function ShapesStylesSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/${slug}`);
}
