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

async function guard() {
  return getAdminSession();
}

export async function GET() {
  if (!(await guard())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedDate: "desc" },
    include: { faqs: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const session = await guard();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = adminBlogSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const faqs = normalizeBlogFaqs(parsed.data.faqs);

  try {
    const post = await prisma.blogPost.create({
      data: {
        ...blogWriteData(parsed.data),
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
    await logAdminActivity(session, {
      action: "CREATE",
      entityType: "blog",
      entityId: post.id,
      entityLabel: post.title,
      summary: `${session.name} created blog "${post.title}"`,
    });
    revalidateBlogs();
    revalidatePath(`/blog/${post.slug}`);
    return NextResponse.json({ post }, { status: 201 });
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
      { error: "Could not create blog post" },
      { status: 500 }
    );
  }
}
