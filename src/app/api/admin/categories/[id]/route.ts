import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
});

type Params = { params: Promise<{ id: string }> };

async function guard() {
  return getAdminSession();
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await guard())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = categorySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const category = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      sortOrder: data.sortOrder,
    },
  });

  return NextResponse.json({ category });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await guard())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
