import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#172455]">Quote Requests</h2>
        <p className="mt-1 text-sm text-gray-500">
          Latest inbound RFQs from the website.
        </p>
      </div>

      <div className="overflow-x-auto bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-[#F6F8FA] text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Qty</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {quotes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  No quote requests yet.
                </td>
              </tr>
            ) : (
              quotes.map((quote) => (
                <tr key={quote.id} className="border-b border-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#172455]">{quote.contactName}</p>
                    <p className="text-xs text-gray-500">{quote.email}</p>
                    <p className="text-xs text-gray-500">{quote.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {quote.productName || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{quote.quantity}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold text-[#FF5548]">
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {quote.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
