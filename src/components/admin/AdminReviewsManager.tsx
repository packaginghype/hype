"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

export type ReviewRow = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  isPublished: boolean;
  sortOrder: number;
};

const inputClass =
  "w-full rounded-[4px] border border-[#E2E4E8] bg-white px-3 py-2.5 text-sm font-medium text-[#172455] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF5548]";

const emptyDraft = {
  name: "",
  role: "",
  quote: "",
  rating: 5,
  isPublished: true,
};

export function AdminReviewsManager({
  initialReviews,
}: {
  initialReviews: ReviewRow[];
}) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState(emptyDraft);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(
        typeof data.error === "string"
          ? data.error
          : "Could not add review. Name and quote are required."
      );
      return;
    }

    setReviews((prev) => [...prev, data.review]);
    setDraft(emptyDraft);
    router.refresh();
  }

  async function onSaveEdit(id: string) {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editDraft),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(
        typeof data.error === "string" ? data.error : "Could not save review"
      );
      return;
    }
    setReviews((prev) => prev.map((row) => (row.id === id ? data.review : row)));
    setEditingId(null);
    router.refresh();
  }

  async function onMove(id: string, move: "up" | "down") {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ move }),
    });
    if (!res.ok) {
      alert("Could not reorder review");
      return;
    }
    const index = reviews.findIndex((row) => row.id === id);
    const swap = move === "up" ? index - 1 : index + 1;
    if (index < 0 || swap < 0 || swap >= reviews.length) return;
    const next = [...reviews];
    [next[index], next[swap]] = [next[swap], next[index]];
    setReviews(next);
    router.refresh();
  }

  async function onTogglePublished(row: ReviewRow) {
    const res = await fetch(`/api/admin/reviews/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: row.name,
        role: row.role,
        quote: row.quote,
        rating: row.rating,
        isPublished: !row.isPublished,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert("Could not update visibility");
      return;
    }
    setReviews((prev) =>
      prev.map((item) => (item.id === row.id ? data.review : item))
    );
    router.refresh();
  }

  async function onDelete(row: ReviewRow) {
    if (!confirm(`Delete review from "${row.name}"?`)) return;
    const res = await fetch(`/api/admin/reviews/${row.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      alert("Could not delete review");
      return;
    }
    setReviews((prev) => prev.filter((item) => item.id !== row.id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={onCreate}
        className="space-y-3 rounded-[8px] border border-[#E5E7EB] bg-white p-4"
      >
        <p className="text-sm font-bold text-[#172455]">Add review</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={draft.name}
            onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Customer name"
            className={inputClass}
            required
          />
          <input
            value={draft.role}
            onChange={(e) => setDraft((prev) => ({ ...prev, role: e.target.value }))}
            placeholder="Title / company"
            className={inputClass}
          />
        </div>
        <textarea
          rows={3}
          value={draft.quote}
          onChange={(e) => setDraft((prev) => ({ ...prev, quote: e.target.value }))}
          placeholder="Review quote"
          className={`${inputClass} resize-y`}
          required
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-[#172455]">
            Rating
            <select
              value={draft.rating}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, rating: Number(e.target.value) }))
              }
              className={inputClass + " w-auto"}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] bg-[#FF5548] px-4 py-2 text-sm font-bold text-white hover:bg-[#e04337] disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {loading ? "Adding…" : "Add Review"}
          </button>
        </div>
        {error ? <p className="text-sm text-[#FF5548]">{error}</p> : null}
      </form>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="rounded-[8px] border border-dashed border-[#E5E7EB] bg-white px-4 py-10 text-center text-sm text-[#6B7280]">
            No reviews yet. Add the first customer review above.
          </p>
        ) : (
          reviews.map((row, i) => (
            <div
              key={row.id}
              className="rounded-[8px] border border-[#E5E7EB] bg-white p-4"
            >
              {editingId === row.id ? (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={editDraft.name}
                      onChange={(e) =>
                        setEditDraft((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className={inputClass}
                    />
                    <input
                      value={editDraft.role}
                      onChange={(e) =>
                        setEditDraft((prev) => ({ ...prev, role: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={editDraft.quote}
                    onChange={(e) =>
                      setEditDraft((prev) => ({ ...prev, quote: e.target.value }))
                    }
                    className={`${inputClass} resize-y`}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={editDraft.rating}
                      onChange={(e) =>
                        setEditDraft((prev) => ({
                          ...prev,
                          rating: Number(e.target.value),
                        }))
                      }
                      className={inputClass + " w-auto"}
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} stars
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => onSaveEdit(row.id)}
                      className="cursor-pointer rounded-[4px] bg-[#172455] px-3 py-2 text-xs font-bold text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="cursor-pointer rounded-[4px] px-3 py-2 text-xs font-semibold text-[#6B7280]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-[#172455]">{row.name}</p>
                      <p className="text-xs text-[#6B7280]">{row.role}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onMove(row.id, "up")}
                        disabled={i === 0}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border border-[#E2E4E8] text-[#172455] hover:bg-[#F8FAFC] disabled:opacity-30"
                        aria-label="Move up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMove(row.id, "down")}
                        disabled={i === reviews.length - 1}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border border-[#E2E4E8] text-[#172455] hover:bg-[#F8FAFC] disabled:opacity-30"
                        aria-label="Move down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] text-[#FF5548] hover:bg-[#FFF5F4]"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[#3F4A5E]">
                    “{row.quote}”
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold">
                    <span className="text-[#FF5548]">
                      {row.rating} / 5 stars
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(row.id);
                        setEditDraft({
                          name: row.name,
                          role: row.role,
                          quote: row.quote,
                          rating: row.rating,
                          isPublished: row.isPublished,
                        });
                      }}
                      className="cursor-pointer text-[#21AAA5] hover:text-[#FF5548]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onTogglePublished(row)}
                      className="cursor-pointer text-[#6B7280] hover:text-[#172455]"
                    >
                      {row.isPublished ? "Hide from homepage" : "Show on homepage"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
