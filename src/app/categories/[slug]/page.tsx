import { redirect } from "next/navigation";
import { getCategoryBySlug } from "@/lib/catalog";

// Permanent redirect: /categories/[slug] → /category/[slug] (or /industry/[slug])
export default async function CategoriesSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (category?.group === "industries") {
    redirect(`/industry/${slug}`);
  }
  if (category?.group === "materials") {
    redirect(`/box-by-material/${slug}`);
  }
  if (category?.group === "shapes") {
    redirect(`/shapes-styles/${slug}`);
  }
  redirect(`/category/${slug}`);
}
