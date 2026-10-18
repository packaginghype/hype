"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "STAFF";
  isActive: boolean;
  createdAt: string;
};

const inputClass =
  "w-full rounded-[4px] border border-[#E2E4E8] bg-white px-3 py-2.5 text-sm font-medium text-[#172455] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF5548]";

export function AdminUsersManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: AdminUserRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"SUPER_ADMIN" | "STAFF">("STAFF");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Could not create user");
      return;
    }

    setUsers((prev) => [
      {
        ...data.user,
        createdAt: data.user.createdAt || new Date().toISOString(),
      },
      ...prev,
    ]);
    setName("");
    setEmail("");
    setPassword("");
    setRole("STAFF");
    router.refresh();
  }

  async function setActive(id: string, isActive: boolean) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Update failed");
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive } : u))
    );
    router.refresh();
  }

  async function setUserRole(id: string, nextRole: "SUPER_ADMIN" | "STAFF") {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Update failed");
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: nextRole } : u))
    );
    router.refresh();
  }

  async function onDelete(id: string, label: string) {
    if (!confirm(`Delete account "${label}"?`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Delete failed");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white">
        <div className="admin-section-bar bg-[#172455] px-4 py-2.5 sm:px-5">
          <p className="text-sm font-bold uppercase tracking-wider text-white">
            Add Account
          </p>
        </div>
        <form onSubmit={onCreate} className="space-y-4 p-4 sm:p-5">
          <p className="text-sm text-[#4B5563]">
            Staff can edit content. Super Admin can also manage users, inquiries,
            and activity logs.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-[#172455]">
                Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-[#172455]">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-[#172455]">
                Password
              </label>
              <input
                required
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Min 8 characters"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-[#172455]">
                Access
              </label>
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "SUPER_ADMIN" | "STAFF")
                }
                className={inputClass}
              >
                <option value="STAFF">Staff (content only)</option>
                <option value="SUPER_ADMIN">Super Admin (full access)</option>
              </select>
            </div>
          </div>
          {error ? (
            <p className="text-sm font-medium text-red-600">
              {typeof error === "string" ? error : "Could not create user"}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[4px] bg-[#FF5548] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#e04337] disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white">
        <div className="admin-section-bar bg-[#172455] px-4 py-2.5 sm:px-5">
          <p className="text-sm font-bold uppercase tracking-wider text-white">
            Accounts ({users.length})
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-[#F6F8FA] text-xs uppercase tracking-wider text-[#172455]">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Access</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#172455]">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      disabled={user.id === currentUserId}
                      onChange={(e) =>
                        setUserRole(
                          user.id,
                          e.target.value as "SUPER_ADMIN" | "STAFF"
                        )
                      }
                      className="cursor-pointer rounded-[4px] border border-[#E2E4E8] bg-white px-2 py-1.5 text-xs font-bold text-[#172455] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="STAFF">Staff</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={user.id === currentUserId}
                      onClick={() => setActive(user.id, !user.isActive)}
                      className={`cursor-pointer rounded-[4px] px-2.5 py-1 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-60 ${
                        user.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {user.isActive ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      disabled={user.id === currentUserId}
                      onClick={() => onDelete(user.id, user.email)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-[4px] px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
