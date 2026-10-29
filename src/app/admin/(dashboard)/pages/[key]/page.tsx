import { notFound } from "next/navigation";
import { getStaticPageDef } from "@/lib/static-pages";
import { StaticPageForm } from "@/components/admin/StaticPageForm";
import { HomePageForm } from "@/components/admin/HomePageForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ key: string }> };

export default async function AdminStaticPageEditor({ params }: Props) {
  const { key } = await params;
  const def = getStaticPageDef(key);
  if (!def) notFound();

  if (def.kind === "home") {
    return (
      <div className="min-h-screen bg-[#F6F8FA] p-4 sm:p-6 lg:p-8">
        <HomePageForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FA] p-4 sm:p-6 lg:p-8">
      <StaticPageForm
        pageKey={def.key}
        title={def.title}
        path={def.path}
        kind={def.kind}
        defaults={def.defaults}
      />
    </div>
  );
}
