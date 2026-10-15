import { Metadata } from "next";
import { CategoryCollectionPage } from "@/components/categories/CategoryCollectionPage";
import { CATEGORY_GROUPS } from "@/data/category-groups";
import { getCategoriesByGroup } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${CATEGORY_GROUPS.industries.title} | Custom Packaging`,
  description: CATEGORY_GROUPS.industries.description,
};

export default async function IndustriesPage() {
  const categories = await getCategoriesByGroup("industries");
  return <CategoryCollectionPage group="industries" categories={categories} />;
}
