import { IndustrySolutionsSection } from "@/components/home/IndustrySolutionsSection";
import { getIndustryShowcaseCategories } from "@/lib/catalog";
import { HOME_PAGE_DEFAULTS, type HomePageData } from "@/lib/home-page-schema";

export async function IndustrySolutions({
  industryHeading = HOME_PAGE_DEFAULTS.industryHeading,
  industrySubtext = HOME_PAGE_DEFAULTS.industrySubtext,
}: Partial<Pick<HomePageData, "industryHeading" | "industrySubtext">> = {}) {
  const categories = await getIndustryShowcaseCategories(10);
  const items = categories.map((category) => ({
    ...category,
    label: category.name.toLowerCase().startsWith("custom ")
      ? category.name
      : `Custom ${category.name}`,
  }));

  return (
    <IndustrySolutionsSection
      items={items}
      heading={industryHeading || HOME_PAGE_DEFAULTS.industryHeading || ""}
      subtext={industrySubtext || HOME_PAGE_DEFAULTS.industrySubtext || ""}
    />
  );
}
