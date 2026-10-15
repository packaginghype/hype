import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#172455]">Add Category</h2>
        <p className="mt-1 text-sm text-gray-500">Create a new packaging category.</p>
      </div>
      <CategoryForm />
    </div>
  );
}
