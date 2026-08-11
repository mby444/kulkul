import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KulKul - AI Cooking Companion",
  description: "Kulik isi kulkasmu, masak lezat tanpa pusing!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="min-h-screen max-w-md mx-auto bg-bg-app text-text-main font-sans flex flex-col relative shadow-sm border-x border-border">
        {children}
      </body>
    </html>
  );
}
