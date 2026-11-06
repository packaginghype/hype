import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import {
  adminBlogSchema,
  blogWriteData,
  normalizeBlogFaqs,
} from "@/lib/admin-blog-schema";
import { revalidateBlogs } from "@/lib/cache";
import { logAdminActivity } from "@/lib/admin-activity";
import { deleteRemovedCloudinaryAssets } from "@/lib/cloudinary";

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
    const faqs = normalizeBlogFaqs(newData.faqs);

    const oldImageUrls = [
      existing.featuredImage,
      existing.thumbnailImageUrl,
      existing.faqsImageUrl,
    ];
    const newImageUrls = [
      newData.bannerImageUrl ?? null,
      newData.thumbnailImageUrl ?? null,
      newData.faqsImageUrl ?? null,
    ];

    const post = await prisma.$transaction(async (tx) => {
      await tx.blogPostFaq.deleteMany({ where: { blogPostId: id } });
      return tx.blogPost.update({
        where: { id },
        data: {
          ...blogWriteData(newData),
          faqs: {
            create: faqs.map((faq, index) => ({
              question: faq.question,
              answer: faq.answer,
              sortOrder: index,
            })),
          },
        },
        include: { faqs: { orderBy: { sortOrder: "asc" } } },
      });
    });

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
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code?: string }).code)
        : "";
    if (code === "P2002") {
      return NextResponse.json(
        { error: "Blog slug already exists. Choose a different slug." },
        { status: 409 }
      );
    }
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

    await deleteRemovedCloudinaryAssets(
      [
        existing.featuredImage,
        existing.thumbnailImageUrl,
        existing.faqsImageUrl,
      ],
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
