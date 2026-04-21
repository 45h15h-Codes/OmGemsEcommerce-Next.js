import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Cursor } from "@/components/ui/Cursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fontSerif = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Om Gems - B2B Luxury Diamonds",
  description: "Exquisite B2B and B2C luxury diamond and jewelry marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable} h-full antialiased bg-background text-foreground`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Cursor />
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}


