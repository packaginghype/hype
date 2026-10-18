import Link from "next/link";
import { Construction } from "lucide-react";

export function AdminPlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#172455]">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex flex-col items-start gap-3 rounded-[8px] border border-dashed border-[#D5DBE7] bg-white px-6 py-10">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF5F4] text-[#FF5548]">
          <Construction className="h-5 w-5" />
        </span>
        <p className="max-w-lg text-sm leading-relaxed text-[#4B5563]">
          This section is ready in the sidebar. Full CRUD / content tools for{" "}
          <strong className="text-[#172455]">{title}</strong> can be expanded
          next — description fields across admin already use CKEditor.
        </p>
        <Link
          href="/admin"
          className="text-sm font-bold text-[#21AAA5] hover:text-[#FF5548]"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
