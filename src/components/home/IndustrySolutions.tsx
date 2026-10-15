import { IndustrySolutionsSection } from "@/components/home/IndustrySolutionsSection";
import { getIndustryShowcaseCategories } from "@/lib/catalog";

export async function IndustrySolutions() {
  const categories = await getIndustryShowcaseCategories(10);
  const items = categories.map((category) => ({
    ...category,
    label: category.name.toLowerCase().startsWith("custom ")
      ? category.name
      : `Custom ${category.name}`,
  }));

  return <IndustrySolutionsSection items={items} />;
}
