"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteBlogButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  async function onDelete() {
    if (!confirm(`Delete blog post "${title}"?`)) return;
    const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete blog post");
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      className="inline-flex cursor-pointer items-center gap-1 rounded-[4px] px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete
    </button>
  );
}
