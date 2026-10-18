import type { CategoryGroup } from "@prisma/client";

export type CategoryGroupKey = "categories" | "industries" | "materials" | "shapes";

export const CATEGORY_GROUP_META: Record<
  CategoryGroupKey,
  {
    label: string;
    singularLabel: string;
    adminHref: string;
    publicHref: string;
    description: string;
  }
> = {
  categories: {
    label: "Categories",
    singularLabel: "Category",
    adminHref: "/admin/categories",
    publicHref: "/categories",
    description: "General product categories shown in the header Categories menu.",
  },
  industries: {
    label: "Industries",
    singularLabel: "Industry",
    adminHref: "/admin/industries",
    publicHref: "/industries",
    description: "Industry-focused packaging categories.",
  },
  materials: {
    label: "Box by Materials",
    singularLabel: "Box by Material",
    adminHref: "/admin/box-by-material",
    publicHref: "/box-by-material",
    description: "Material-based packaging categories.",
  },
  shapes: {
    label: "Shapes & Styles",
    singularLabel: "Shape & Style",
    adminHref: "/admin/shapes-styles",
    publicHref: "/shapes-styles",
    description: "Box shape and style categories.",
  },
};

export function isCategoryGroupKey(value: string): value is CategoryGroupKey {
  return value in CATEGORY_GROUP_META;
}

export function toPrismaGroup(group: CategoryGroupKey): CategoryGroup {
  return group;
}

export function adminNewCategoryHref(group: CategoryGroupKey) {
  if (group === "industries") return "/admin/industries/new";
  if (group === "materials") return "/admin/box-by-material/new";
  if (group === "shapes") return "/admin/shapes-styles/new";
  return "/admin/categories/new";
}

export function adminEditCategoryHref(id: string, group?: CategoryGroupKey) {
  if (group === "industries") return `/admin/industries/${id}`;
  if (group === "materials") return `/admin/box-by-material/${id}`;
  if (group === "shapes") return `/admin/shapes-styles/${id}`;
  return `/admin/categories/${id}`;
}
