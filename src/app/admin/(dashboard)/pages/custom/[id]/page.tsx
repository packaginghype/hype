import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CustomPageForm } from "@/components/admin/CustomPageForm";
import { parsePageLayout } from "@/lib/page-layout";
import { parsePageWidgets } from "@/lib/page-widgets";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditCustomPage({ params }: Props) {
  const { id } = await params;
  const page = await prisma.customPage.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div className="min-h-screen bg-[#F6F8FA] p-4 sm:p-6 lg:p-8">
      <CustomPageForm
        initial={{
          id: page.id,
          title: page.title,
          slug: page.slug,
          menuLabel: page.menuLabel,
          showInHeader: page.showInHeader,
          showInFooter: page.showInFooter,
          menuOrder: page.menuOrder,
          published: page.published,
          eyebrow: page.eyebrow,
          heading: page.heading,
          intro: page.intro,
          content: page.content,
          sections: parsePageWidgets(page.sections),
          layout: parsePageLayout(page.layout),
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          seoKeywords: page.seoKeywords,
          seoCanonical: page.seoCanonical,
        }}
      />
    </div>
  );
}
