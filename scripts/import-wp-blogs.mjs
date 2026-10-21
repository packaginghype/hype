import fs from "fs";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
          ...options.headers,
        },
      });
      if (res.ok) return res;
      if (res.status === 400 || res.status === 404) return res;
      console.warn(`Attempt ${i + 1} got status ${res.status} for ${url}`);
    } catch (err) {
      console.warn(`Attempt ${i + 1} failed: ${err.message}`);
    }
    await sleep(1500 * (i + 1));
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

async function run() {
  console.log("Starting WordPress blog posts download...");
  const perPage = 20;
  let page = 1;
  let allPosts = [];

  while (true) {
    const url = `https://packaginghype.com/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}&status=publish`;
    console.log(`Fetching page ${page}...`);
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      console.log(`Stopped at page ${page} (status ${res.status})`);
      break;
    }
    const posts = await res.json();
    if (!posts || !posts.length) {
      console.log(`No more posts returned on page ${page}`);
      break;
    }

    allPosts.push(...posts);
    const totalPages = Number(res.headers.get("x-wp-totalpages") || 1);
    const totalPosts = Number(res.headers.get("x-wp-total") || allPosts.length);
    console.log(`Page ${page}/${totalPages} complete (${allPosts.length}/${totalPosts} posts fetched)`);

    if (page >= totalPages) break;
    page++;
    await sleep(300); // polite rate limit
  }

  console.log(`\nSuccessfully fetched all ${allPosts.length} posts from WordPress API!`);

  // Now collect media IDs that are needed
  const mediaMap = new Map();
  const mediaIds = [...new Set(allPosts.map((p) => p.featured_media).filter((id) => id && id > 0))];
  console.log(`Found ${mediaIds.length} featured media items to resolve.`);

  let mediaCount = 0;
  for (const mid of mediaIds) {
    try {
      const mres = await fetchWithRetry(`https://packaginghype.com/wp-json/wp/v2/media/${mid}`);
      if (mres.ok) {
        const mdata = await mres.json();
        mediaMap.set(mid, {
          sourceUrl: mdata.source_url || mdata.guid?.rendered || null,
          altText: mdata.alt_text || "",
          title: mdata.title?.rendered || "",
        });
      }
    } catch (e) {
      console.warn(`Could not fetch media ${mid}: ${e.message}`);
    }
    mediaCount++;
    if (mediaCount % 10 === 0 || mediaCount === mediaIds.length) {
      console.log(`Fetched media ${mediaCount}/${mediaIds.length}`);
    }
    await sleep(150);
  }

  // Format all posts for our BlogPost model
  const formatted = allPosts.map((p) => {
    const media = mediaMap.get(p.featured_media) || null;
    const yoast = p.yoast_head_json || {};
    const ogImg = yoast.og_image?.[0]?.url || null;

    const featuredImage = media?.sourceUrl || ogImg || null;
    const featuredAlt = media?.altText || p.title?.rendered || "";
    const featuredTitle = media?.title || p.title?.rendered || "";

    // Clean title (remove html entities like &#8211;, &amp;, etc.)
    const rawTitle = p.title?.rendered || "";
    const title = rawTitle
      .replace(/&#8211;/g, "–")
      .replace(/&#8212;/g, "—")
      .replace(/&#8217;/g, "’")
      .replace(/&#8216;/g, "‘")
      .replace(/&#038;/g, "&")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&hellip;/g, "…")
      .replace(/<[^>]*>/g, "")
      .trim();

    return {
      wpId: p.id,
      title,
      slug: p.slug,
      excerpt: p.excerpt?.rendered ? p.excerpt.rendered.replace(/<[^>]*>/g, "").trim() : null,
      content: p.content?.rendered || "",
      publishedDate: p.date ? new Date(p.date).toISOString() : new Date().toISOString(),
      featuredImage,
      bannerImageUrl: featuredImage,
      bannerImageAlt: featuredAlt,
      bannerImageTitle: featuredTitle,
      thumbnailImageUrl: featuredImage,
      thumbnailImageAlt: featuredAlt,
      thumbnailImageTitle: featuredTitle,
      author: "Packaging Hype Team",
      seoTitle: yoast.title || title,
      seoDescription: yoast.description || null,
      seoKeywords: null,
      isPublished: p.status === "publish",
      categories: p.categories || [],
    };
  });

  fs.writeFileSync("scripts/wp-blogs-imported.json", JSON.stringify(formatted, null, 2));
  console.log(`\nAll ${formatted.length} posts saved to scripts/wp-blogs-imported.json`);
}

run().catch(console.error);
