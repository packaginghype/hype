import { redirect } from "next/navigation";

// 301: /category/[slug] → /[slug]
export default async function CategoryRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/${slug}`);
}
