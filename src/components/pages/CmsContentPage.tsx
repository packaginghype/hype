import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RichText } from "@/components/ui/RichText";
import type { StaticPageData } from "@/lib/static-pages";

export function CmsContentPage({
  title,
  data,
  children,
}: {
  title: string;
  data: StaticPageData;
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F6F8FA] py-10 sm:py-16">
      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ label: data.heading || title }]} />

        <div className="mt-8 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-12">
          {data.eyebrow ? (
            <span className="mb-3 inline-block rounded-full bg-[#eaf7f6] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#21AAA5]">
              {data.eyebrow}
            </span>
          ) : null}
          <h1 className="text-3xl font-extrabold tracking-tight text-[#172455] sm:text-4xl">
            {data.heading || title}
          </h1>
          {data.intro ? (
            <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
              {data.intro}
            </p>
          ) : null}
          {children}
          {data.content ? (
            <div className="border-t border-gray-100 pt-2">
              <RichText html={data.content} />
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
