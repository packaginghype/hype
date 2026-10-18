import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteBlogButton } from "@/components/admin/DeleteBlogButton";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedDate: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#172455]">Blogs</h2>
          <p className="mt-1 text-sm text-gray-500">{posts.length} posts</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex cursor-pointer items-center gap-2 rounded-[4px] bg-[#FF5548] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#e04337]"
        >
          <Plus className="h-4 w-4" />
          Add Post
        </Link>
      </div>

      <div className="overflow-x-auto bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-[#F6F8FA] text-xs uppercase tracking-wider text-[#172455]">
            <tr>
              <th className="px-4 py-3 font-semibold">Post</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Featured</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  No blog posts yet. Create your first post.
                </td>
              </tr>
            ) : (
              posts.map((post) => {
                const thumb =
                  post.thumbnailImageUrl ||
                  post.bannerImageUrl ||
                  post.featuredImage;
                return (
                  <tr key={post.id} className="border-b border-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-[4px] bg-[#F6F8FA]">
                          {thumb ? (
                            <Image
                              src={thumb}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="64px"
                              unoptimized
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#172455]">
                            {post.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {post.publishedDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#4B5563]">
                      {post.slug}
                    </td>
                    <td className="px-4 py-3 text-[#4B5563]">
                      {post.featuredEnabled ? "On" : "Off"}
                    </td>
                    <td className="px-4 py-3 text-[#4B5563]">
                      {post.isPublished ? "Published" : "Draft"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
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
  );
}
