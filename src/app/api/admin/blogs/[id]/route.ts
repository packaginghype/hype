import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { adminBlogSchema, blogWriteData } from "@/lib/admin-blog-schema";
import { revalidateBlogs } from "@/lib/cache";
import { logAdminActivity } from "@/lib/admin-activity";
import {
  deleteRemovedCloudinaryAssets,
} from "@/lib/cloudinary";

type Params = { params: Promise<{ id: string }> };

async function guard() {
  return getAdminSession();
}

export async function PUT(request: Request, { params }: Params) {
  const session = await guard();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = adminBlogSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const newData = parsed.data;

    // Collect old Cloudinary image URLs from blog (featuredImage = bannerImageUrl in DB)
    const oldImageUrls = [
      existing.featuredImage,   // same as bannerImageUrl in DB
      existing.thumbnailImageUrl,
    ];
    // newData uses bannerImageUrl which maps to featuredImage in blogWriteData
    const newImageUrls = [
      newData.bannerImageUrl ?? null,
      newData.thumbnailImageUrl ?? null,
    ];

    const post = await prisma.blogPost.update({
      where: { id },
      data: blogWriteData(newData),
    });

    // Delete Cloudinary assets that were removed/replaced
    await deleteRemovedCloudinaryAssets(oldImageUrls, newImageUrls);

    await logAdminActivity(session, {
      action: "UPDATE",
      entityType: "blog",
      entityId: post.id,
      entityLabel: post.title,
      summary: `${session.name} updated blog "${post.title}"`,
    });

    revalidateBlogs();
    revalidatePath(`/blog/${post.slug}`);
    if (existing.slug !== post.slug) {
      revalidatePath(`/blog/${existing.slug}`);
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await guard();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.blogPost.delete({ where: { id } });

    // Delete all Cloudinary images associated with this blog post
    // featuredImage and bannerImageUrl are the same value in the DB
    await deleteRemovedCloudinaryAssets(
      [existing.featuredImage, existing.thumbnailImageUrl],
      []
    );

    await logAdminActivity(session, {
      action: "DELETE",
      entityType: "blog",
      entityId: existing.id,
      entityLabel: existing.title,
      summary: `${session.name} deleted blog "${existing.title}"`,
    });

    revalidateBlogs();
    revalidatePath(`/blog/${existing.slug}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not delete blog post" },
      { status: 500 }
    );
  }
}
