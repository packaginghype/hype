"use client";

import dynamic from "next/dynamic";

const CkEditorField = dynamic(
  () =>
    import("@/components/admin/CkEditorField").then((m) => m.CkEditorField),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-40 items-center justify-center rounded-[4px] border border-[#E2E4E8] bg-[#F8FAFC] text-xs font-semibold text-[#9CA3AF]">
        Loading editor…
      </div>
    ),
  }
);

/** Shared rich description editor (CKEditor) — lazy-loaded for faster admin shells. */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write the description…",
  className,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <CkEditorField
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  );
}
