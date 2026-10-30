import { redirect } from "next/navigation";

// 301: /industry/[slug] → /[slug]
export default async function IndustryRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/${slug}`);
}
