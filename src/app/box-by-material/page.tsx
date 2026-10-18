import { Metadata } from "next";
import { CategoryCollectionPage } from "@/components/categories/CategoryCollectionPage";
import { CATEGORY_GROUPS } from "@/data/category-groups";
import { getCategoriesByGroup } from "@/lib/catalog";

export const revalidate = 120;

export const metadata: Metadata = {
  title: `${CATEGORY_GROUPS.materials.title} | Custom Packaging`,
  description: CATEGORY_GROUPS.materials.description,
};

export default async function BoxByMaterialPage() {
  const categories = await getCategoriesByGroup("materials");
  return <CategoryCollectionPage group="materials" categories={categories} />;
}
