import { redirect } from "next/navigation";

// Forward /products?q=... and /products?category=... to the actual product search page at /product
export default async function ProductsPageRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams(params).toString();
  redirect(qs ? `/product?${qs}` : "/product");
}
