"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function onDelete() {
    if (!confirm(`Delete product "${name}"?`)) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete product");
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      className="inline-flex items-center gap-1 rounded-[4px] px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete
    </button>
  );
}
