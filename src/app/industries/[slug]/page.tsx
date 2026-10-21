import { redirect } from "next/navigation";

// Permanent redirect: /industries/[slug] → /industry/[slug]
export default async function IndustriesSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/industry/${slug}`);
}
