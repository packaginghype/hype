import React from "react";

export function AdminTableSkeleton({
  title = "Loading...",
  buttonText = "Add Item",
}: {
  title?: string;
  buttonText?: string;
}) {
  return (
    <div className="w-full max-w-none animate-pulse space-y-6">
      {/* List Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1.5">
          <div className="h-8 w-44 rounded bg-[#D5DAE2]" />
          <div className="h-4 w-60 rounded bg-[#EEF0F4]" />
        </div>
        <div className="h-10 w-36 rounded-[4px] bg-[#FF5548]/40" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[6px] border border-gray-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-[#F6F8FA] text-xs uppercase tracking-wider text-[#172455]">
            <tr>
              <th className="px-4 py-3 font-bold">Item</th>
              <th className="px-4 py-3 font-bold">Slug</th>
              <th className="px-4 py-3 font-bold">Products</th>
              <th className="px-4 py-3 font-bold">Order</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Array.from({ length: 7 }).map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 rounded bg-[#E8EAEF]" />
                    <div className="h-4 w-36 rounded bg-[#E2E4E8]" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-3.5 w-28 rounded bg-[#EEF0F4]" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-3.5 w-8 rounded bg-[#EEF0F4]" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-3.5 w-6 rounded bg-[#EEF0F4]" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-7 w-14 rounded bg-[#EEF0F4]" />
                    <div className="h-7 w-16 rounded bg-[#FFC5C1]/40" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
