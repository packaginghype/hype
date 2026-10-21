import fs from "fs";

async function fetchAllPosts() {
  let allPosts = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    console.log(`Fetching page ${page}...`);
    const res = await fetch(`https://packaginghype.com/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}&_embed=true`);
    if (!res.ok) {
      console.log(`Finished or error at page ${page}: status ${res.status}`);
      break;
    }
    const posts = await res.json();
    if (!posts.length) break;
    allPosts.push(...posts);
    const totalPages = Number(res.headers.get("x-wp-totalpages") || 1);
    console.log(`Fetched ${posts.length} posts (Total so far: ${allPosts.length} / total pages: ${totalPages})`);
    if (page >= totalPages) break;
    page++;
  }

  console.log(`\nTotal posts retrieved: ${allPosts.length}`);

  // Summary by categories
  const summary = allPosts.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title.rendered,
    date: p.date,
    categories: p.categories,
    hasImage: Boolean(p._embedded?.['wp:featuredmedia']?.[0]?.source_url || p.featured_media),
    imageUrl: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
  }));

  fs.writeFileSync("scripts/posts-summary.json", JSON.stringify(summary, null, 2));
  console.log("Summary saved to scripts/posts-summary.json");
}

fetchAllPosts().catch(console.error);
