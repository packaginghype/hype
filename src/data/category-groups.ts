export type CategoryGroupKey = "categories" | "industries" | "materials" | "shapes";

export const CATEGORY_GROUPS: Record<
  CategoryGroupKey,
  {
    title: string;
    eyebrow: string;
    headline: string;
    description: string;
    browseLabel: string;
    href: string;
    heroImage: string;
  }
> = {
  categories: {
    title: "Categories",
    eyebrow: "Shop by Category",
    headline: "Browse Custom Packaging Categories",
    description:
      "Explore our full range of custom packaging categories — from everyday cartons to specialty structures for every product type.",
    browseLabel: "Browse Categories",
    href: "/categories",
    heroImage: "/images/hero-packaging.jpg",
  },
  industries: {
    title: "Industries",
    eyebrow: "Shop by Industry",
    headline: "Packaging Built for Your Industry and Product Line",
    description:
      "Explore custom packaging solutions tailored to cosmetics, food, CBD, retail, apparel, and more — engineered for protection, presentation, and brand impact.",
    browseLabel: "Browse Industries",
    href: "/industries",
    heroImage: "/images/hero-packaging.jpg",
  },
  materials: {
    title: "Box by Material",
    eyebrow: "Shop by Material",
    headline: "Choose the Right Material for Strength, Finish, and Feel",
    description:
      "From kraft and corrugated to rigid board and barrier pouches — pick the material that fits your product weight, shelf look, and shipping needs.",
    browseLabel: "Browse Materials",
    href: "/box-by-material",
    heroImage: "/images/reliable-packaging-boxes.jpg",
  },
  shapes: {
    title: "Shapes & Styles",
    eyebrow: "Shop by Shape & Style",
    headline: "Find the Box Style That Fits Your Unboxing Experience",
    description:
      "Mailers, rigid boxes, gift structures, display packs, and specialty formats — browse styles designed for shipping, retail, and premium presentation.",
    browseLabel: "Browse Shapes & Styles",
    href: "/shapes-styles",
    heroImage: "/images/hero-packaging.jpg",
  },
};
