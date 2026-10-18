import { prisma } from "@/lib/prisma";
import { requireSuperAdminPage } from "@/lib/admin-guards";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await requireSuperAdminPage();

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#172455]">Users</h2>
        <p className="mt-1 text-sm text-[#4B5563]">
          Create staff accounts and control who can access inquiries and logs.
        </p>
      </div>
      <AdminUsersManager
        currentUserId={session.sub}
        initialUsers={users.map((u) => ({
          ...u,
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
