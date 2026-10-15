import Link from "next/link";
import { Layers, Package, MessageSquareQuote, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [categoryCount, productCount, publishedCount, pendingQuotes] =
    await Promise.all([
      prisma.category.count(),
      prisma.product.count(),
      prisma.product.count({ where: { isPublished: true } }),
      prisma.quoteRequest.count({ where: { status: "PENDING" } }),
    ]);

  const cards = [
    {
      label: "Categories",
      value: categoryCount,
      href: "/admin/categories",
      icon: Layers,
      hint: "Industry & material groups",
    },
    {
      label: "Products",
      value: productCount,
      href: "/admin/products",
      icon: Package,
      hint: `${publishedCount} published`,
    },
    {
      label: "Pending Quotes",
      value: pendingQuotes,
      href: "/admin/quotes",
      icon: MessageSquareQuote,
      hint: "Awaiting review",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#172455]">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your Packaging Hype catalog and inbound quote requests.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white p-5 transition-colors hover:bg-[#FFF8F7]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center bg-[#eaf7f6] text-[#21AAA5]">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300" />
              </div>
              <p className="mt-4 text-3xl font-bold text-[#172455]">{card.value}</p>
              <p className="mt-1 text-sm font-semibold text-[#172455]">{card.label}</p>
              <p className="mt-0.5 text-xs text-gray-500">{card.hint}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
