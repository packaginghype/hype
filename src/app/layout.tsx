import type { Metadata, Viewport } from "next";
import { Poppins, Raleway } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { getNavCategories } from "@/lib/catalog";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const raleway = Raleway({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#172455",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://packaginghype.com"),
  title: {
    default: "Packaging Hype | Custom Packaging Boxes Manufacturer USA",
    template: "%s | Packaging Hype",
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
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://packaginghype.com",
    siteName: "Packaging Hype",
    title: "Packaging Hype | Custom Packaging Boxes Manufacturer",
    description:
      "Premier custom box manufacturer. Free 3D dieline proofs, low 100 unit MOQ, and free doorstep shipping across the United States.",
    images: [
      {
        url: "/images/hero-packaging.jpg",
        width: 1200,
        height: 630,
        alt: "Packaging Hype Custom Box Manufacturer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Packaging Hype | Custom Packaging Boxes Manufacturer",
    description:
      "Wholesale custom printed boxes, mailers, and folding cartons. Low MOQ 100 with free USA shipping.",
    images: ["/images/hero-packaging.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nav = await getNavCategories();

  return (
    <html lang="en" className={`${poppins.variable} ${raleway.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-800">
        <AppShell
          industries={nav.industries.map((c) => ({ name: c.name, slug: c.slug }))}
          materials={nav.materials.map((c) => ({ name: c.name, slug: c.slug }))}
          footerCategories={nav.all}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
