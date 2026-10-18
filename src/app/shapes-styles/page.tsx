import { Metadata } from "next";
import { CategoryCollectionPage } from "@/components/categories/CategoryCollectionPage";
import { CATEGORY_GROUPS } from "@/data/category-groups";
import { getCategoriesByGroup } from "@/lib/catalog";

export const revalidate = 120;

export const metadata: Metadata = {
  title: `${CATEGORY_GROUPS.shapes.title} | Custom Packaging`,
  description: CATEGORY_GROUPS.shapes.description,
};

export default async function ShapesStylesPage() {
  const categories = await getCategoriesByGroup("shapes");
  return <CategoryCollectionPage group="shapes" categories={categories} />;
}
