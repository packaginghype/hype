import type { Metadata, Viewport } from "next";
import { Poppins, Raleway } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { getNavCategories } from "@/lib/catalog";
import { getGeneralSettings } from "@/lib/general-settings";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

const raleway = Raleway({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#172455",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGeneralSettings();
  const favicon = settings.faviconUrl || "/favicon.png";
  const siteName = settings.siteName || "Packaging Hype";

  return {
    metadataBase: new URL("https://packaginghype.com"),
    title: {
      default: `${siteName} | Custom Packaging Boxes Manufacturer USA`,
      template: "%s",
    },
    description:
      "Packaging Hype manufactures premium custom packaging boxes, folding cartons, corrugated mailers, and flexible barrier bags. Fast turnaround, low 100 MOQ, free design support, and free USA shipping.",
    keywords: [
      "custom packaging boxes",
      "custom boxes",
      "corrugated mailer boxes",
      "rigid boxes",
      "kraft packaging",
      "folding cartons",
      "mylar bags",
      "custom box manufacturer",
    ],
    authors: [{ name: "Packaging Hype Team" }],
    icons: {
      icon: [{ url: favicon }],
      apple: [{ url: favicon }],
      shortcut: favicon,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://packaginghype.com",
      siteName,
      title: `${siteName} | Custom Packaging Boxes Manufacturer`,
      description:
        "Premier custom box manufacturer. Free 3D dieline proofs, low 100 unit MOQ, and free doorstep shipping across the United States.",
      images: [
        {
          url: "/images/hero-packaging.jpg",
          width: 1200,
          height: 630,
          alt: `${siteName} Custom Box Manufacturer`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | Custom Packaging Boxes Manufacturer`,
      description:
        "Wholesale custom printed boxes, mailers, and folding cartons. Low MOQ 100 with free USA shipping.",
      images: ["/images/hero-packaging.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [nav, settings] = await Promise.all([
    getNavCategories(),
    getGeneralSettings(),
  ]);

  return (
    <html lang="en" className={`${poppins.variable} ${raleway.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href={settings.faviconUrl || "/favicon.png"} />
        <link rel="apple-touch-icon" href={settings.faviconUrl || "/favicon.png"} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-800">
        <AppShell
          categories={nav.categories.map((c) => ({ name: c.name, slug: c.slug }))}
          industries={nav.industries.map((c) => ({ name: c.name, slug: c.slug }))}
          materials={nav.materials.map((c) => ({ name: c.name, slug: c.slug }))}
          footerCategories={nav.categories}
          logoUrl={settings.logoUrl}
          logoAlt={settings.logoAlt}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
