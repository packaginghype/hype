import { Metadata } from "next";
import { CategoryCollectionPage } from "@/components/categories/CategoryCollectionPage";
import { CATEGORY_GROUPS } from "@/data/category-groups";
import { getCategoriesByGroup } from "@/lib/catalog";

export const revalidate = 120;

export const metadata: Metadata = {
  title: `${CATEGORY_GROUPS.categories.title} | Custom Packaging`,
  description: CATEGORY_GROUPS.categories.description,
};

export default async function CategoriesPage() {
  const categories = await getCategoriesByGroup("categories");
  return <CategoryCollectionPage group="categories" categories={categories} />;
}
