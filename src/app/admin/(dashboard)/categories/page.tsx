import { AdminCategoryList } from "@/components/admin/AdminCategoryList";

export const dynamic = "force-dynamic";

export default function AdminCategoriesPage() {
  return <AdminCategoryList group="categories" />;
}
