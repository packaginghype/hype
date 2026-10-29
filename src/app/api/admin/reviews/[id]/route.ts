import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { logAdminActivity } from "@/lib/admin-activity";
import { customerReviewSchema } from "@/lib/customer-reviews";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);

  try {
    const existing = await prisma.customerReview.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (body?.move === "up" || body?.move === "down") {
      const neighbors = await prisma.customerReview.findMany({
        orderBy: { sortOrder: "asc" },
        select: { id: true, sortOrder: true },
      });
      const index = neighbors.findIndex((row) => row.id === id);
      const swapWith =
        body.move === "up" ? neighbors[index - 1] : neighbors[index + 1];
      if (!swapWith) {
        return NextResponse.json({ review: existing });
      }

      const [review] = await prisma.$transaction([
        prisma.customerReview.update({
          where: { id },
          data: { sortOrder: swapWith.sortOrder },
        }),
        prisma.customerReview.update({
          where: { id: swapWith.id },
          data: { sortOrder: existing.sortOrder },
        }),
      ]);

      revalidatePath("/");
      return NextResponse.json({ review });
    }

    const parsed = customerReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const review = await prisma.customerReview.update({
      where: { id },
      data: parsed.data,
    });

    await logAdminActivity(session, {
      action: "UPDATE",
      entityType: "review",
      entityId: review.id,
      entityLabel: review.name,
      summary: `${session.name} updated customer review from "${review.name}"`,
    });
    revalidatePath("/");

    return NextResponse.json({ review });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.customerReview.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.customerReview.delete({ where: { id } });
    await logAdminActivity(session, {
      action: "DELETE",
      entityType: "review",
      entityId: existing.id,
      entityLabel: existing.name,
      summary: `${session.name} deleted customer review from "${existing.name}"`,
    });
    revalidatePath("/");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not delete review" },
      { status: 500 }
    );
  }
}
