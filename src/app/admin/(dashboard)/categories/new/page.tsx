import {
  CategoryForm,
  DEFAULT_PACKAGING_IMAGES,
} from "@/components/admin/CategoryForm";
import {
  CATEGORY_GROUP_META,
  isCategoryGroupKey,
  type CategoryGroupKey,
} from "@/lib/category-groups";

export default async function NewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const params = await searchParams;
  const rawGroup = params.group || "categories";
  const group: CategoryGroupKey = isCategoryGroupKey(rawGroup)
    ? rawGroup
    : "categories";
  const meta = CATEGORY_GROUP_META[group];

  return (
    <div className="w-full max-w-none space-y-6">
      <div>
        <a
          href={meta.adminHref}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5548] hover:text-[#e04337]"
        >
          ← Back to {meta.label}
        </a>
        <h2 className="mt-1 text-2xl font-bold text-[#172455]">Add {meta.singularLabel}</h2>
        <p className="mt-1 text-sm text-gray-500">
          Create a new item under {meta.label}.
        </p>
      </div>
      <CategoryForm defaultGroup={group} defaultImages={DEFAULT_PACKAGING_IMAGES} />
    </div>
  );
}
