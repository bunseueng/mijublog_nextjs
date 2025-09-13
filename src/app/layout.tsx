import "./globals.css";
// fonts.js

import { Roboto, Nunito } from "next/font/google";
import Navbar from "@/components/home/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SocketProvider } from "@/provider/SocketProvider";
import { getBlog, getCategories } from "./data/blog/get-blog";
import { Suspense } from "react";
import Footer from "@/components/home/Footer";
import { Metadata } from "next";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"], // 400 for body, 700 for headings
  variable: "--font-roboto",
});

export const nunito = Nunito({
  subsets: ["latin"],
  weight: ["700"], // bold for title
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://mijublogjjy.vercel.app"
  ),
  title: {
    default: "MijuBlog - Your Ultimate Blogging Platform",
    template: "%s | MijuBlog",
  },
  description:
    "Discover amazing stories, insights, and knowledge on MijuBlog. Join our community of writers and readers.",
  keywords: ["blog", "writing", "stories", "articles", "community"],
  authors: [{ name: "MijuBlog Team" }],
  creator: "MijuBlog",
  publisher: "MijuBlog",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "MijuBlog",
    title: "MijuBlog - Your Ultimate Blogging Platform",
    description:
      "Discover amazing stories, insights, and knowledge on MijuBlog.",
    images: [
      {
        url: "/web-app-manifest-512x512.png",
        width: 1200,
        height: 630,
        alt: "MijuBlog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MijuBlog - Your Ultimate Blogging Platform",
    description:
      "Discover amazing stories, insights, and knowledge on MijuBlog.",
    images: ["/web-app-manifest-512x512.png"],
    creator: "@mijublog",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();
  const blog_posts = await getBlog();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${nunito.variable}`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SocketProvider>
            <div className="bg-navbg dark:bg-background">
              <div className="container mx-auto py-4 px-8">
                <Suspense fallback>
                  <Navbar categories={categories} blog_posts={blog_posts} />
                </Suspense>
              </div>
            </div>
            {children}
            <Footer />
            <Toaster />
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
