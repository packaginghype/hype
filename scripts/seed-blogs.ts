import { prisma } from "../src/lib/prisma";

async function run() {
  const posts = [
    {
      title: "How to Choose the Right Corrugated Mailer for E-Commerce Shipping",
      slug: "how-to-choose-corrugated-mailer-boxes",
      excerpt:
        "Discover essential fluting guides, burst strength ratings, and unboxing designs to protect your products during transit while elevating customer experience.",
      content:
        "<p>Corrugated mailers are the gold standard for modern direct-to-consumer delivery. From flute selection (E-flute vs B-flute) to double-sided CMYK printing, selecting the ideal structure protects your goods while delivering an unforgettable brand impression on the doorstep.</p>",
      featuredImage: "/images/blog-mailer-boxes.jpg",
      thumbnailImageUrl: "/images/blog-mailer-boxes.jpg",
      bannerImageUrl: "/images/blog-mailer-boxes.jpg",
      featuredEnabled: true,
      isPublished: true,
    },
    {
      title: "Luxury Rigid Boxes: Enhancing Unboxing Experience and Perceived Value",
      slug: "luxury-rigid-boxes-unboxing-experience",
      excerpt:
        "Explore magnetic closures, shoulder neck structures, and foam inserts engineered for high-ticket electronics, jewelry, and luxury retail gift sets.",
      content:
        "<p>Rigid boxes offer non-collapsible structural strength combined with ultra-premium wrapping papers, soft-touch matte lamination, and magnetic closures that reinforce prestige branding.</p>",
      featuredImage: "/images/blog-rigid-boxes.jpg",
      thumbnailImageUrl: "/images/blog-rigid-boxes.jpg",
      bannerImageUrl: "/images/blog-rigid-boxes.jpg",
      featuredEnabled: true,
      isPublished: true,
    },
    {
      title: "Eco-Friendly Kraft Packaging: Trends and Benefits for Modern Brands",
      slug: "eco-friendly-kraft-packaging-trends",
      excerpt:
        "Learn why biodegradable virgin and recycled kraft board continues to win consumer trust across sustainable skincare, food, and organic lifestyle lines.",
      content:
        "<p>Modern shoppers demand environmental accountability. Recycled kraft paperboard delivers organic, earthy aesthetics with uncompromised tearing and stacking durability.</p>",
      featuredImage: "/images/blog-kraft-boxes.jpg",
      thumbnailImageUrl: "/images/blog-kraft-boxes.jpg",
      bannerImageUrl: "/images/blog-kraft-boxes.jpg",
      featuredEnabled: true,
      isPublished: true,
    },
    {
      title: "Spot UV vs Foil Stamping: Selecting the Perfect Finish for Retail Boxes",
      slug: "spot-uv-vs-foil-stamping-retail-finishes",
      excerpt:
        "A complete breakdown of tactile print finishes, foil temperature curing, and embossing techniques that make retail shelf cartons stand out.",
      content:
        "<p>Gloss spot UV highlights specific logo artwork and patterns with high-shine depth, while hot foil stamping adds metallic brilliance in gold, silver, or holographic foils.</p>",
      featuredImage: "/images/blog-luxury-finishes.jpg",
      thumbnailImageUrl: "/images/blog-luxury-finishes.jpg",
      bannerImageUrl: "/images/blog-luxury-finishes.jpg",
      featuredEnabled: true,
      isPublished: true,
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log("Successfully seeded 4 blog posts!");
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
