import fs from "fs";

const posts = JSON.parse(fs.readFileSync("scripts/wp-blogs-imported.json", "utf8"));
const imgRegex = /https?:\/\/packaginghype\.com\/wp-content\/uploads\/[^\s"'><)]+/gi;
const allUrls = new Set();

for (const p of posts) {
  if (p.featuredImage && p.featuredImage.includes("wp-content/uploads")) {
    allUrls.add(p.featuredImage);
  }
  const matches = p.content.match(imgRegex) || [];
  for (const m of matches) {
    allUrls.add(m);
  }
}

console.log("Total unique WordPress uploads found:", allUrls.size);
console.log("Sample URLs:", Array.from(allUrls).slice(0, 10));

// Also analyze categories of posts
const packagingKeywords = ["box", "packaging", "bag", "print", "mailer", "kraft", "label", "retail", "card", "display", "unboxing", "shipping"];
const packagingPosts = posts.filter(p => {
  const text = (p.title + " " + p.slug).toLowerCase();
  return packagingKeywords.some(kw => text.includes(kw));
});

console.log(`\nPosts with packaging keywords in title/slug: ${packagingPosts.length} out of ${posts.length}`);
fs.writeFileSync("scripts/unique-wp-images.json", JSON.stringify(Array.from(allUrls), null, 2));
