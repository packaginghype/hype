import fs from "fs";
import path from "path";

async function downloadImages() {
  const urls = JSON.parse(fs.readFileSync("scripts/unique-wp-images.json", "utf8"));
  console.log(`Starting download of ${urls.length} images...`);

  let count = 0;
  for (const rawUrl of urls) {
    try {
      // Clean URL (remove query params or trailing punctuation)
      const cleanUrl = rawUrl.replace(/["')>].*$/, "").split("?")[0];
      const parsed = new URL(cleanUrl);
      const pathname = decodeURIComponent(parsed.pathname); // e.g. /wp-content/uploads/2023/07/image.webp
      const localPath = path.join("public", pathname.replace(/^\//, ""));
      const dir = path.dirname(localPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(localPath)) {
        // already downloaded
        count++;
        continue;
      }

      const res = await fetch(cleanUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(localPath, Buffer.from(buffer));
        count++;
        if (count % 10 === 0 || count === urls.length) {
          console.log(`Downloaded ${count}/${urls.length}: ${localPath}`);
        }
      } else {
        console.warn(`HTTP ${res.status} for ${cleanUrl}`);
      }
    } catch (err) {
      console.warn(`Failed to download ${rawUrl}: ${err.message}`);
    }
  }

  console.log(`\nCompleted downloading ${count}/${urls.length} images to public/wp-content/uploads!`);
}

downloadImages().catch(console.error);
