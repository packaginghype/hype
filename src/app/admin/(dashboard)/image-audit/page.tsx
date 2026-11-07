"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Globe,
  Search,
  Copy,
  Check,
} from "lucide-react";
import type { AuditEntry } from "@/app/api/admin/image-audit/route";

type AuditResult = {
  total: number;
  missing: number;
  external: number;
  results: AuditEntry[];
};

type Filter = "all" | "missing" | "ok" | "external";

function StatusBadge({ status }: { status: AuditEntry["status"] }) {
  if (status === "ok")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
        <CheckCircle2 className="h-3 w-3" /> OK
      </span>
    );
  if (status === "missing")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">
        <AlertCircle className="h-3 w-3" /> Missing
      </span>
    );
  if (status === "external")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
        <Globe className="h-3 w-3" /> External
      </span>
    );
  return (
    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
      Empty
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      title="Copy URL"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="ml-1 inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-[#9CA3AF] transition hover:text-[#172455]"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function ImageAuditPage() {
  const [data, setData] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("missing");
  const [search, setSearch] = useState("");

  async function runAudit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/image-audit");
      if (!res.ok) throw new Error("Audit failed");
      const json = await res.json() as AuditResult;
      setData(json);
    } catch {
      setError("Could not run audit. Check server logs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void runAudit();
  }, []);

  const filtered = (data?.results || []).filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.url.toLowerCase().includes(q) ||
        r.usedIn.some((u) => u.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#172455]">
            Image Audit
          </h1>
          <p className="mt-0.5 text-sm text-[#6B7280]">
            Checks all images in the database against Cloudinary — finds broken
            (missing) URLs.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void runAudit()}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[6px] bg-[#172455] px-4 text-sm font-bold text-white transition hover:bg-[#0f1839] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Scanning…" : "Run Audit"}
        </button>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Total Images",
              value: data.total,
              color: "text-[#172455]",
              bg: "bg-white",
            },
            {
              label: "Missing (Broken)",
              value: data.missing,
              color: data.missing > 0 ? "text-red-600" : "text-emerald-600",
              bg: data.missing > 0 ? "bg-red-50" : "bg-emerald-50",
            },
            {
              label: "OK on Cloudinary",
              value: data.total - data.missing - data.external,
              color: "text-emerald-700",
              bg: "bg-emerald-50",
            },
            {
              label: "External URLs",
              value: data.external,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-[10px] border border-[#E5E7EB] ${stat.bg} p-4`}
            >
              <p className="text-xs font-semibold text-[#6B7280]">
                {stat.label}
              </p>
              <p className={`mt-1 text-2xl font-extrabold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* How to fix */}
      {data && data.missing > 0 && (
        <div className="rounded-[10px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-bold">🔧 Missing images ko kaise fix karo:</p>
          <ol className="mt-2 list-decimal pl-5 space-y-1">
            <li>
              <strong>Used In</strong> column se product/category name dekho
            </li>
            <li>
              Admin → us product/category ko edit karo
            </li>
            <li>
              Broken image field mein <strong>naya image upload karo</strong> →
              Apply → Save
            </li>
          </ol>
          <p className="mt-2 text-xs text-amber-700">
            💡 Broken images ka Cloudinary par file exist nahi karti (shayad
            delete/move ho gayi). Re-upload karna zaroori hai.
          </p>
        </div>
      )}

      {data && data.missing === 0 && !loading && (
        <div className="rounded-[10px] border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          ✅ Sari images Cloudinary par exist karti hain — koi broken link nahi!
        </div>
      )}

      {/* Filter + Search */}
      {data && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-[8px] border border-[#E5E7EB] bg-white p-1">
            {(["missing", "all", "ok", "external"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-[6px] px-3 py-1.5 text-xs font-semibold transition ${
                  filter === f
                    ? "bg-[#172455] text-white"
                    : "text-[#6B7280] hover:text-[#172455]"
                }`}
              >
                {f === "missing"
                  ? `Missing (${data.missing})`
                  : f === "ok"
                    ? `OK (${data.total - data.missing - data.external})`
                    : f === "external"
                      ? `External (${data.external})`
                      : `All (${data.total})`}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search URL or product/category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[7px] border border-[#E5E7EB] bg-white py-2 pl-8 pr-3 text-sm text-[#172455] placeholder:text-[#9CA3AF] outline-none focus:border-[#172455]"
            />
          </div>
        </div>
      )}

      {/* Table */}
      {loading && !data && (
        <div className="flex items-center gap-3 py-16 text-[#6B7280]">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Scanning all images in database and Cloudinary…</span>
        </div>
      )}

      {data && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-[10px] border border-[#E5E7EB] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F6F8FA] text-left text-xs font-bold text-[#6B7280]">
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">URL</th>
                <th className="px-4 py-3">Used In</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={`${row.url}-${i}`}
                  className={`border-b border-[#F3F4F6] last:border-0 ${
                    row.status === "missing" ? "bg-red-50/40" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#444]">
                    <div className="flex max-w-[320px] items-center gap-1">
                      <span className="truncate" title={row.url}>
                        {row.url}
                      </span>
                      <CopyButton text={row.url} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      {row.usedIn.map((u) => {
                        // Extract type (product/category/blog) and slug
                        const [type, rest] = u.split(":");
                        const [slug, field] = (rest || "").split(" ");
                        const href =
                          type === "product"
                            ? `/admin/products?q=${encodeURIComponent(slug || "")}`
                            : type === "category"
                              ? `/admin/categories?q=${encodeURIComponent(slug || "")}`
                              : type === "blog"
                                ? `/admin/blogs?q=${encodeURIComponent(slug || "")}`
                                : null;
                        return (
                          <span key={u} className="inline-flex items-center gap-1">
                            <span className="text-xs text-[#172455]">
                              <span className="font-semibold">{slug}</span>
                              <span className="text-[#9CA3AF]"> {field}</span>
                            </span>
                            {href && (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#FF5548] hover:underline"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {row.status === "missing" ? (
                      <span className="text-xs font-semibold text-red-600">
                        Re-upload needed
                      </span>
                    ) : row.status === "external" ? (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      >
                        Open <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-emerald-600">✓ Live</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && filtered.length === 0 && !loading && (
        <div className="py-12 text-center text-sm text-[#9CA3AF]">
          No results for current filter.
        </div>
      )}
    </div>
  );
}

