import type { NextConfig } from "next";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "xujsn9ij";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Preview in browser tab instead of forcing a download
    contentDispositionType: "inline",
    // Clean same-origin /media/... URLs instead of long Cloudinary addresses
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-image-loader.ts",
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "packaginghype.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        // Browser sees /media/folder/file — transforms stay server-side only
        source: "/media/:path*",
        destination: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/:path*`,
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
