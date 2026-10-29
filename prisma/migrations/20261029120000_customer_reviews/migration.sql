CREATE TABLE "CustomerReview" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT '',
    "quote" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerReview_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CustomerReview_isPublished_sortOrder_idx" ON "CustomerReview"("isPublished", "sortOrder");
CREATE INDEX "CustomerReview_sortOrder_idx" ON "CustomerReview"("sortOrder");

INSERT INTO "CustomerReview" ("id", "name", "role", "quote", "rating", "isPublished", "sortOrder", "createdAt", "updatedAt")
VALUES
  (
    'cmreview_sarah_mitchell',
    'Sarah Mitchell',
    'Founder, Glow Botanics',
    'Our soap boxes looked premium and arrived on time. The team helped refine our dieline and the print quality exceeded expectations.',
    5,
    true,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'cmreview_james_carter',
    'James Carter',
    'Ops Lead, Northline Goods',
    'Reliable mailers, clear communication, and free shipping made scaling our e-commerce packaging painless. We’ll reorder every quarter.',
    5,
    true,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'cmreview_aisha_rahman',
    'Aisha Rahman',
    'Brand Manager, Candle & Co.',
    'Rigid boxes with soft-touch finish elevated our unboxing. Design support was fast and the MOQ worked perfectly for a growing brand.',
    5,
    true,
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'cmreview_daniel_ortiz',
    'Daniel Ortiz',
    'Owner, FreshBite Bakery',
    'Custom bakery boxes held up in transit and looked sharp on the shelf. Pricing was competitive and turnaround stayed on schedule.',
    5,
    true,
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );
