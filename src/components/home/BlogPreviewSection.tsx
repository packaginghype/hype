import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getBlogsByIds, getFeaturedBlogs } from "@/lib/blogs";
import { HOME_PAGE_DEFAULTS, type HomePageData } from "@/lib/home-page-schema";

const DEFAULT_POSTS = [
  {
    title: "How to Choose the Right Corrugated Mailer for E-Commerce Shipping",
    slug: "how-to-choose-corrugated-mailer-boxes",
    image: "/images/blog-mailer-boxes.jpg",
  },
  {
    title: "Luxury Rigid Boxes: Enhancing Unboxing Experience and Perceived Value",
    slug: "luxury-rigid-boxes-unboxing-experience",
    image: "/images/blog-rigid-boxes.jpg",
  },
  {
    title: "Eco-Friendly Kraft Packaging: Trends and Benefits for Modern Brands",
    slug: "eco-friendly-kraft-packaging-trends",
    image: "/images/blog-kraft-boxes.jpg",
  },
  {
    title: "Spot UV vs Foil Stamping: Selecting the Perfect Finish for Retail Boxes",
    slug: "spot-uv-vs-foil-stamping-retail-finishes",
    image: "/images/blog-luxury-finishes.jpg",
  },
];

export async function BlogPreviewSection({
  blogsHeading = HOME_PAGE_DEFAULTS.blogsHeading,
  blogsSubtext = HOME_PAGE_DEFAULTS.blogsSubtext,
  blogIds = HOME_PAGE_DEFAULTS.blogIds,
}: Partial<
  Pick<HomePageData, "blogsHeading" | "blogsSubtext" | "blogIds">
> = {}) {
  const ids = blogIds?.filter(Boolean) || [];
  const dbPosts =
    ids.length > 0 ? await getBlogsByIds(ids) : await getFeaturedBlogs(4);

  const mapped = dbPosts.map((p) => ({
    title: p.title,
    slug: p.slug,
    image:
      p.thumbnailImageUrl ||
      p.featuredImage ||
      p.bannerImageUrl ||
      "/images/blog-mailer-boxes.jpg",
  }));
  const posts = ids.length > 0 ? mapped : mapped.length > 0 ? mapped : DEFAULT_POSTS;

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 border-t border-gray-100">
      <Container>
        <div className="grid items-start gap-8 lg:grid-cols-[380px_1fr] xl:grid-cols-[410px_1fr] lg:gap-10 xl:gap-12">
          {/* Left Column: Heading + Description + 3D Illustration Card */}
          <div className="flex flex-col">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-[#1A1349] sm:text-4xl lg:text-[40px] lg:leading-[1.15]">
              {blogsHeading || "Latest News"}
            </h2>
            {blogsSubtext ? (
              <p className="mt-3.5 max-w-md text-[14.5px] leading-relaxed text-[#5B667A] sm:text-[15px]">
                {blogsSubtext}
              </p>
            ) : null}

            <Link
              href="/blog"
              className="mt-3.5 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-[#FF5548] transition-colors hover:text-[#e04337]"
            >
              <span>Explore all articles</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            {/* 3D Illustration Card matching reference */}
            <div className="relative mt-7 overflow-hidden rounded-[20px] bg-[#FBF6EE] p-3 sm:p-4 shadow-sm border border-[#F2E8D8]">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px]">
                <Image
                  src="/images/packaging-guide-3d.jpg"
                  alt="Packaging Guide and Design Workspace"
                  fill
                  sizes="(max-width: 1024px) 100vw, 410px"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  priority={false}
                />
              </div>
            </div>
          </div>

          {/* Right Column: 2x2 Grid of Blog Cards with Bottom Overlay */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {posts.slice(0, 4).map((post) => (
              <article
                key={post.slug}
                className="group relative isolate aspect-[4/3] overflow-hidden rounded-2xl border border-[#E8EAEF] bg-[#0F172A]"
              >
                {/* Background Image */}
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  unoptimized={post.image.startsWith("http")}
                />

                {/* Dark Gradient Overlay */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent transition-opacity duration-300 group-hover:from-black/95"
                />

                {/* Bottom Bar: Title on left, Read Now button on right */}
                <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4 sm:p-5">
                  <h3 className="min-w-0 flex-1">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="line-clamp-2 text-[14px] sm:text-[15px] font-bold leading-snug text-white transition-colors group-hover:text-white/95"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-[8px] bg-[#2D1B69] px-3.5 py-2 text-[12px] font-bold text-white transition-colors duration-200 hover:bg-[#FF5548] group-hover:bg-[#FF5548]"
                    aria-label={`Read ${post.title}`}
                  >
                    <span>Read Now</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
