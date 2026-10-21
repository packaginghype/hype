import { redirect } from "next/navigation";

// Redirect /products → /categories
export default function ProductsPageRedirect() {
  redirect("/categories");
}
