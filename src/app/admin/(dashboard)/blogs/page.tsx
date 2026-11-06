import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteBlogButton } from "@/components/admin/DeleteBlogButton";
import { Pagination } from "@/components/ui/Pagination";
import { getBlogFallbackImage } from "@/lib/blogs";
import { toMediaUrl } from "@/lib/media-url";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type Props = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

function resolveThumb(url?: string | null): string | null {
  if (!url?.trim()) return null;
  return toMediaUrl(url) || url;
}

export default async function AdminBlogsPage({ searchParams }: Props) {
  const { page: pageParam, q } = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(pageParam || "1", 10) || 1);
  const query = q?.trim();

  const where = query
    ? {
        OR: [
          { title: { contains: query, mode: "insensitive" as const } },
          { slug: { contains: query, mode: "insensitive" as const } },
          { author: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const total = await prisma.blogPost.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: { publishedDate: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div className="w-full max-w-none space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-[#172455]">Blogs</h2>
          <p className="mt-1 text-sm text-gray-500">
            {total} posts · {PAGE_SIZE} per page · page {page} of {totalPages}
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-[4px] bg-[#FF5548] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#e04337]"
        >
          <Plus className="h-4 w-4" />
          Add Post
        </Link>
      </div>

      <form className="flex w-full flex-wrap gap-2" action="/admin/blogs" method="get">
        <input
          type="search"
          name="q"
          defaultValue={query || ""}
          placeholder="Search title, slug, author…"
          className="min-w-0 flex-1 rounded-[4px] border border-[#E2E4E8] px-3 py-2 text-sm outline-none focus:border-[#FF5548] sm:min-w-[260px]"
        />
        <button
          type="submit"
          className="shrink-0 rounded-[4px] bg-[#172455] px-4 py-2 text-sm font-bold text-white hover:bg-[#0f1839]"
        >
          Search
        </button>
      </form>

      <div className="w-full rounded-[8px] border border-[#E8EAEF] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead className="border-b border-gray-100 bg-[#F6F8FA] text-xs uppercase tracking-wider text-[#172455]">
              <tr>
                <th className="px-4 py-3 font-semibold">Post</th>
                <th className="w-[110px] whitespace-nowrap px-4 py-3 font-semibold">
                  Featured
                </th>
                <th className="w-[120px] whitespace-nowrap px-4 py-3 font-semibold">
                  Status
                </th>
                <th className="w-[180px] whitespace-nowrap px-4 py-3 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    {query
                      ? "No blog posts match your search."
                      : "No blog posts yet. Create your first post."}
                  </td>
                </tr>
              ) : (
                posts.map((post) => {
                  const thumb =
                    resolveThumb(post.thumbnailImageUrl) ||
                    resolveThumb(post.bannerImageUrl) ||
                    resolveThumb(post.featuredImage) ||
                    getBlogFallbackImage(post.slug || post.id);

                  return (
                    <tr
                      key={post.id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-start gap-3">
                          <div className="relative mt-0.5 h-12 w-16 shrink-0 overflow-hidden rounded-[4px] bg-[#F6F8FA]">
                            <Image
                              src={thumb}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="64px"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="break-words font-semibold leading-snug text-[#172455]">
                              {post.title}
                            </p>
                            <p className="mt-0.5 break-all text-xs leading-snug text-gray-500">
                              /blog/{post.slug}
                            </p>
                            <p className="mt-1 whitespace-nowrap text-[11px] text-gray-400">
                              {post.publishedDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                              {post.category ? ` · ${post.category}` : ""}
                              {post.author ? ` · ${post.author}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-middle">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            post.featuredEnabled
                              ? "bg-[#EEF2FF] text-[#172455]"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {post.featuredEnabled ? "On" : "Off"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-middle">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            post.isPublished
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {post.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right align-middle">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/blogs/${post.id}`}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-[4px] px-2.5 py-1.5 text-xs font-bold text-[#172455] hover:bg-[#F6F8FA]"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                          <DeleteBlogButton id={post.id} title={post.title} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/admin/blogs"
        params={query ? { q: query } : {}}
      />
    </div>
  );
}
