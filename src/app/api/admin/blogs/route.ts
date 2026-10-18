import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { adminBlogSchema, blogWriteData } from "@/lib/admin-blog-schema";
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

  try {
    const post = await prisma.blogPost.create({
      data: blogWriteData(parsed.data),
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
    console.error(error);
    return NextResponse.json(
      { error: "Could not create blog post" },
      { status: 500 }
    );
  }
}
