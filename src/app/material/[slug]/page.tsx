import { redirect } from "next/navigation";

export default async function MaterialSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/box-by-material/${slug}`);
}
