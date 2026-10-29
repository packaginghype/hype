import { prisma } from "@/lib/prisma";
import { AdminReviewsManager } from "@/components/admin/AdminReviewsManager";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.customerReview.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#172455]">Reviews</h2>
        <p className="mt-1 text-sm text-[#4B5563]">
          Add, edit, remove, and reorder customer reviews shown in “What Our
          Customers Say” on the homepage. Heading and description for that
          section are set under Pages → Home Page.
        </p>
      </div>
      <AdminReviewsManager initialReviews={reviews} />
    </div>
  );
}
