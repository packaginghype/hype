import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { getAllCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Custom Packaging Categories | Packaging Hype",
  description:
    "Explore custom packaging box categories including Kraft Boxes, Corrugated Shipping Mailers, Luxury Rigid Boxes, Mylar Pouches, and Retail Cartons.",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="bg-[#F6F8FA] min-h-screen py-10 sm:py-16">
      <Container>
        <Breadcrumbs items={[{ label: "Packaging Categories" }]} />

        <div className="mt-6 mb-12">
          <SectionHeading
            badge="Wholesale Packaging Directory"
            title="Custom Packaging by Category"
            description={`Explore our full selection of ${categories.length} custom box styles and packaging solutions. Every category features bespoke dimensions, dieline engineering, and full-color printing.`}
            align="left"
            className="mb-0 max-w-3xl"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </div>
  );
}
