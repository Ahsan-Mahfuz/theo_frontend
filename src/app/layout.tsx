import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { LanguageProvider } from '../contexts/language-context';
import "./globals.css";
import { cn } from "@/lib/utils";

const urbanist = Urbanist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "gestlio - Professional Cleaning Service",
  description: "gestlio is a professional cleaning service that provides high-quality cleaning services to its customers. With years of experience in the cleaning industry, we have built a reputation for excellence and reliability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "font-sans", urbanist.variable)}
    >
      <LanguageProvider>
        <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
      </LanguageProvider>
    </html>
  );
}
