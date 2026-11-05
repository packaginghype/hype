import { CustomPageForm } from "@/components/admin/CustomPageForm";

export const dynamic = "force-dynamic";

export default function AdminNewCustomPage() {
  return (
    <div className="min-h-screen bg-[#F6F8FA] p-4 sm:p-6 lg:p-8">
      <CustomPageForm />
    </div>
  );
}
