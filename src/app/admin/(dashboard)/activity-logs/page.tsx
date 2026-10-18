import { prisma } from "@/lib/prisma";
import { requireSuperAdminPage } from "@/lib/admin-guards";

export const dynamic = "force-dynamic";

function actionTone(action: string) {
  switch (action) {
    case "CREATE":
      return "bg-emerald-50 text-emerald-700";
    case "DELETE":
      return "bg-red-50 text-red-700";
    case "LOGIN":
      return "bg-sky-50 text-sky-700";
    case "UPDATE":
    case "STATUS":
      return "bg-amber-50 text-amber-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default async function AdminActivityLogsPage() {
  await requireSuperAdminPage();

  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#172455]">Activity Logs</h2>
        <p className="mt-1 text-sm text-[#4B5563]">
          Every admin create, update, delete, and login — who did what.
        </p>
      </div>

      <div className="overflow-hidden rounded-[8px] border border-[#E8EAEF] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-[#F6F8FA] text-xs uppercase tracking-wider text-[#172455]">
              <tr>
                <th className="px-4 py-3 font-semibold">When</th>
                <th className="px-4 py-3 font-semibold">Who</th>
                <th className="px-4 py-3 font-semibold">Action</th>
                <th className="px-4 py-3 font-semibold">What</th>
                <th className="px-4 py-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No activity yet. Edits and logins will appear here.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                      {log.createdAt.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#172455]">
                        {log.actorName}
                      </p>
                      <p className="text-xs text-gray-500">{log.actorEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-[4px] px-2 py-1 text-[11px] font-bold uppercase ${actionTone(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium capitalize text-[#172455]">
                        {log.entityType.replace("_", " ")}
                      </p>
                      {log.entityLabel ? (
                        <p className="text-xs text-gray-500">
                          {log.entityLabel}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-[#4B5563]">{log.summary}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
