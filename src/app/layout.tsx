import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conxian UI",
  description: "UI for interacting with Conxian contracts on Stacks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-background">
      <head>
        <link rel="icon" href="/conxian-mark-b.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${inter.variable} font-sans h-full antialiased text-text`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main id="main-content" className="flex-1 py-10">
              <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
