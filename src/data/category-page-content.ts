import type { CategoryItem, ProductItem } from "@/types";

export type CategoryMaterialItem = {
  title: string;
  description: string;
  bestFor: string;
  imageUrl?: string;
};

function cleanName(name: string) {
  return name.replace(/^Custom\s+/i, "").trim();
}

function splitDescription(description: string): string[] {
  const parts = description
    .split(/(?<=[.!?])\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 2) return parts;
  return [description];
}

export function getCategoryHeroCopy(category: CategoryItem) {
  const name = cleanName(category.name);
  const paragraphs = splitDescription(category.description);
  const fallback = `Packaging Hype creates custom ${name.toLowerCase()} with premium materials, precise sizing, and free design support for food, cosmetics, retail, and specialty brands.`;

  return {
    title: category.name.toLowerCase().startsWith("custom")
      ? category.name
      : `Custom ${name}`,
    paragraphs:
      paragraphs.length >= 2
        ? paragraphs.slice(0, 2)
        : [paragraphs[0] || fallback, fallback],
  };
}

export function getCategoryAboutContent(category: CategoryItem) {
  const name = cleanName(category.name);
  return {
    heading: `${name} That Protect Your Products and Elevate Presentation.`,
    paragraphs: [
      `Quality packaging does more than hold your product — it protects every shipment and elevates how customers experience your brand. Our custom ${name.toLowerCase()} are built for durability, clean presentation, and retail-ready unboxing.`,
      `At Packaging Hype, we offer custom printing, finishes, and sizes tailored to your product line. From first mockup to final delivery, our team helps you get packaging that looks premium and performs on every order.`,
      category.description,
    ],
    imageUrl: category.imageUrl,
  };
}

const DEFAULT_MATERIALS: Omit<CategoryMaterialItem, "imageUrl">[] = [
  {
    title: "White Stock Boxes",
    description:
      "A clean, bright surface ideal for vibrant branding and full-color printing that makes product details pop on shelf.",
    bestFor: "cosmetics, perfume, and retail gift packaging.",
  },
  {
    title: "Natural Kraft Boxes",
    description:
      "Eco-friendly kraft stock with a warm, authentic finish that signals sustainability without sacrificing durability.",
    bestFor: "food products, organic brands, and everyday retail.",
  },
  {
    title: "Coated Board Boxes",
    description:
      "Smooth coated board with glossy or matte options for sharp graphics, scuff resistance, and a retail-ready feel.",
    bestFor: "serums, essential oils, and premium consumer goods.",
  },
  {
    title: "Recycled Material Boxes",
    description:
      "Responsible fiber options that keep your packaging sturdy while supporting eco-conscious brand messaging.",
    bestFor: "sustainable product lines and subscription brands.",
  },
];

export function getCategoryMaterials(
  category: CategoryItem,
  products: ProductItem[]
): CategoryMaterialItem[] {
  const name = cleanName(category.name);
  const images = products.map((p) => p.imageUrl).filter(Boolean);

  return DEFAULT_MATERIALS.map((item, index) => ({
    ...item,
    title: item.title.replace("Boxes", name),
    imageUrl: images[index] || category.imageUrl,
  }));
}

export function getCategoryDesignOptions(
  category: CategoryItem,
  products: ProductItem[]
) {
  const name = cleanName(category.name);
  const images = products
    .map((p) => p.imageUrl)
    .filter(Boolean)
    .slice(0, 3);

  while (images.length < 3 && category.imageUrl) {
    images.push(category.imageUrl);
  }

  return {
    heading: `Design Options for ${name}`,
    description: `Choose from tuck-end, sleeve, mailer, window, and handle designs to create custom ${name.toLowerCase()} that match your brand.`,
    images,
  };
}
