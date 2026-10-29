import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const customerReviewSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  role: z.string().trim().max(160).default(""),
  quote: z.string().trim().min(1, "Review text is required").max(2000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  isPublished: z.boolean().optional().default(true),
});

export type CustomerReviewInput = z.infer<typeof customerReviewSchema>;

export type PublicCustomerReview = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export async function getPublishedCustomerReviews(): Promise<
  PublicCustomerReview[]
> {
  try {
    const rows = await prisma.customerReview.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        role: true,
        quote: true,
        rating: true,
      },
    });
    return rows.filter((row) => row.quote.trim() && row.name.trim());
  } catch {
    return [];
  }
}
