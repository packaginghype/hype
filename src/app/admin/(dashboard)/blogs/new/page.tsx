import { BlogForm } from "@/components/admin/BlogForm";

export const dynamic = "force-dynamic";

export default function NewBlogPage() {
  return (
    <div className="w-full max-w-none space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#172455]">Add Blog Post</h2>
        <p className="mt-1 text-sm font-medium text-[#4B5563]">
          Create a new packaging guide or article
        </p>
      </div>
      <BlogForm />
    </div>
  );
}
