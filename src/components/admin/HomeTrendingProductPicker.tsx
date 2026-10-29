"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";

type ProductOption = { id: string; name: string };

export function HomeTrendingProductPicker({
  selectedIds,
  onChange,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [all, setAll] = useState<ProductOption[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.products || []).map(
          (p: { id: string; name: string }) => ({
            id: p.id,
            name: p.name,
          })
        );
        setAll(list);
      })
      .finally(() => setLoading(false));
  }, []);

  const byId = useMemo(() => new Map(all.map((p) => [p.id, p])), [all]);
  const selected = selectedIds
    .map((id) => byId.get(id))
    .filter(Boolean) as ProductOption[];

  const choices = all.filter((p) => {
    if (selectedIds.includes(p.id)) return false;
    if (!query.trim()) return true;
    return p.name.toLowerCase().includes(query.trim().toLowerCase());
  });

  function add(id: string) {
    if (selectedIds.includes(id)) return;
    onChange([...selectedIds, id]);
    setQuery("");
  }

  function remove(id: string) {
    onChange(selectedIds.filter((x) => x !== id));
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...selectedIds];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <p className="text-[12px] font-medium text-[#4B5563]">
        Selected products appear on the homepage in this order. If none are
        selected, the latest published products are shown.
      </p>

      {selected.length === 0 ? (
        <div className="rounded-[6px] border border-dashed border-[#E2E4E8] bg-[#F8FAFC] px-3 py-6 text-center text-[12px] text-[#9CA3AF]">
          {loading ? "Loading products…" : "No products selected yet"}
        </div>
      ) : (
        <ol className="space-y-2">
          {selected.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-[6px] border border-[#E2E4E8] bg-white px-3 py-2"
            >
              <span className="w-5 shrink-0 text-[11px] font-bold text-[#9CA3AF]">
                {index + 1}.
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#172455]">
                {item.name}
              </span>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border border-[#E2E4E8] text-[#172455] hover:bg-[#F6F8FA] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === selected.length - 1}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border border-[#E2E4E8] text-[#172455] hover:bg-[#F6F8FA] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] bg-[#FF5548] text-white hover:bg-[#e04337]"
                  aria-label="Remove"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products to add…"
        className="w-full rounded-[6px] border border-[#E2E4E8] bg-white px-3 py-2.5 text-sm font-medium text-[#172455] outline-none focus:border-[#FF5548]"
      />
      <div className="max-h-48 space-y-1 overflow-y-auto rounded-[6px] border border-[#E2E4E8] bg-white p-2">
        {choices.slice(0, 40).map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => add(p.id)}
            className="flex w-full cursor-pointer items-center justify-between rounded-[4px] px-2.5 py-2 text-left text-xs font-semibold text-[#374151] hover:bg-[#F6F8FA]"
          >
            <span className="truncate">{p.name}</span>
            <Plus className="h-3.5 w-3.5 text-[#172455]" />
          </button>
        ))}
        {choices.length === 0 && !loading ? (
          <p className="px-2 py-3 text-center text-[12px] text-[#9CA3AF]">
            No matching products
          </p>
        ) : null}
      </div>
    </div>
  );
}
