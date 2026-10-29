import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { logAdminActivity } from "@/lib/admin-activity";
import { customerReviewSchema } from "@/lib/customer-reviews";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await prisma.customerReview.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = customerReviewSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const last = await prisma.customerReview.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const review = await prisma.customerReview.create({
      data: {
        ...parsed.data,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });

    await logAdminActivity(session, {
      action: "CREATE",
      entityType: "review",
      entityId: review.id,
      entityLabel: review.name,
      summary: `${session.name} added customer review from "${review.name}"`,
    });
    revalidatePath("/");

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not create review" },
      { status: 500 }
    );
  }
}
