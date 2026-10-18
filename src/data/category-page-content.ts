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

export const CANONICAL_MATERIAL_IMAGES = [
  "/images/materials/white-stock.jpg",
  "/images/materials/natural-kraft.jpg",
  "/images/materials/coated-board.jpg",
  "/images/materials/recycled-corrugated.jpg",
];

export const CANONICAL_DESIGN_IMAGES = [
  "/images/designs/tuck-end-box.jpg",
  "/images/designs/sleeve-tray-box.jpg",
  "/images/designs/mailer-box.jpg",
];

export function getCategoryMaterialSection(
  category: CategoryItem,
  products: ProductItem[]
) {
  const name = cleanName(category.name);
  const heroTitle = category.name.toLowerCase().startsWith("custom")
    ? category.name
    : `Custom ${name}`;
  const defaultHeading = `Explore the Material For ${heroTitle}`;
  const defaultDesc = `Discover premium materials like natural kraft, corrugated, and eco-friendly options for durable, sustainable, and customizable ${category.name.toLowerCase()}.`;

  let heading = defaultHeading;
  let description = defaultDesc;
  let items: CategoryMaterialItem[] = [];

  if (category.cms?.widgetsContent) {
    try {
      const parsed = JSON.parse(category.cms.widgetsContent);
      if (parsed?.materialsHeading) heading = parsed.materialsHeading;
      if (parsed?.materialsDescription) description = parsed.materialsDescription;
      if (Array.isArray(parsed?.materials) && parsed.materials.length > 0) {
        items = parsed.materials.map((m: any, index: number) => ({
          title: m.title || "",
          description: m.description || "",
          bestFor: m.bestFor || "",
          imageUrl:
            typeof m.imageUrl === "string" && m.imageUrl.trim() !== ""
              ? m.imageUrl
              : CANONICAL_MATERIAL_IMAGES[index % CANONICAL_MATERIAL_IMAGES.length],
        }));
      }
    } catch {}
  }

  if (items.length === 0) {
    items = getCategoryMaterials(category, products);
  }

  return { heading, description, items };
}

export function getCategoryMaterials(
  category: CategoryItem,
  products: ProductItem[]
): CategoryMaterialItem[] {
  // Use admin-defined material options if set via widgetsContent JSON
  if (category.cms?.widgetsContent) {
    try {
      const parsed = JSON.parse(category.cms.widgetsContent);
      if (Array.isArray(parsed?.materials) && parsed.materials.length > 0) {
        return (parsed.materials as {
          title: string;
          description: string;
          bestFor: string;
          imageUrl?: string;
        }[]).map((m, index) => ({
          title: m.title,
          description: m.description,
          bestFor: m.bestFor,
          imageUrl:
            typeof m.imageUrl === "string" && m.imageUrl.trim() !== ""
              ? m.imageUrl
              : CANONICAL_MATERIAL_IMAGES[index % CANONICAL_MATERIAL_IMAGES.length],
        }));
      }
    } catch {}
  }

  // Fallback: hardcoded defaults with canonical material images
  const name = cleanName(category.name);

  return DEFAULT_MATERIALS.map((item, index) => ({
    ...item,
    title: item.title.replace("Boxes", name),
    imageUrl: CANONICAL_MATERIAL_IMAGES[index % CANONICAL_MATERIAL_IMAGES.length],
  }));
}

export function getCategoryDesignOptions(
  category: CategoryItem,
  products: ProductItem[]
) {
  const name = cleanName(category.name);
  const defaultHeading = `Design Options for ${name}`;
  const defaultDesc = `Choose from tuck-end, sleeve, mailer, window, and handle designs to create custom ${name.toLowerCase()} that match your brand.`;

  let heading = defaultHeading;
  let description = defaultDesc;
  let customImages: string[] = [];

  if (category.cms?.widgetsContent) {
    try {
      const parsed = JSON.parse(category.cms.widgetsContent);
      if (parsed?.designHeading) heading = parsed.designHeading;
      if (parsed?.designDescription) description = parsed.designDescription;
      if (Array.isArray(parsed?.designImages) && parsed.designImages.length > 0) {
        customImages = parsed.designImages.filter(
          (img: any) => typeof img === "string" && img.trim() !== ""
        );
      }
    } catch {}
  }

  if (customImages.length > 0) {
    return {
      heading,
      description,
      images: customImages,
    };
  }

  return {
    heading,
    description,
    images: [...CANONICAL_DESIGN_IMAGES],
  };
}
