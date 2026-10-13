import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { QueryProvider } from "@/components/system/providers/query-provider";
import { ThemeSync } from "@/components/system/theme-sync";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raadsan Tech | Digital Solutions",
  description: "Raadsan Tech builds modern digital solutions for ambitious businesses.",
};

const themeInitScript = `
(() => {
  try {
    const theme = localStorage.getItem("raadsan-theme");
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable} font-sans h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <QueryProvider>
          <ThemeSync />
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
