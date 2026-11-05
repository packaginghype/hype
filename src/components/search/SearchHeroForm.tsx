"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchHeroForm({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={onSubmit} className="relative mt-3 w-full">
      <label htmlFor="search-page-input" className="sr-only">
        Search for a product
      </label>
      <div className="relative flex w-full overflow-hidden rounded-3xl border border-[#21AAA5] bg-white">
        <input
          id="search-page-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a product..."
          autoComplete="off"
          className="w-full border-none bg-white py-3 pl-5 pr-12 text-[15px] text-[#21AAA5] outline-none placeholder:font-medium placeholder:text-[#21AAA5]/80 sm:py-3.5 sm:pl-6 sm:text-base"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#21AAA5] transition-colors hover:bg-[#EAF7F6] hover:text-[#178f8b]"
          aria-label="Search"
        >
          <Search className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </div>
    </form>
  );
}
