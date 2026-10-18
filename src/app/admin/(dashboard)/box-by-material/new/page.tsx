import { CategoryForm } from "@/components/admin/CategoryForm";
import { CATEGORY_GROUP_META } from "@/lib/category-groups";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewBoxByMaterialPage() {
  const meta = CATEGORY_GROUP_META.materials;
  return (
    <div className="w-full max-w-none space-y-6">
      <div>
        <Link
          href={meta.adminHref}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5548] hover:text-[#e04337]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {meta.label}
        </Link>
        <h2 className="mt-1 text-2xl font-bold text-[#172455]">Add {meta.singularLabel}</h2>
        <p className="mt-1 text-sm text-gray-500">
          Create a new item under {meta.label}.
        </p>
      </div>
      <CategoryForm defaultGroup="materials" />
    </div>
  );
}
