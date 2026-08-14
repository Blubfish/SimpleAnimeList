import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import ScrollUpButton from "@/components/ScrollUpButton";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Anime List",
  description: "My Anime List",
  icons: {
    icon: "/images/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        {children}
        <ScrollUpButton />
        <Analytics />
      </body>
    </html>
  );
}
