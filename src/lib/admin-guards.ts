import { redirect } from "next/navigation";
import { getAdminSession, isSuperAdmin, type AdminSession } from "@/lib/admin-auth";

export async function requireSuperAdminPage(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!isSuperAdmin(session)) redirect("/admin");
  return session;
}
