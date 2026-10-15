import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F6F8FA] text-sm text-gray-500">
          Loading...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
