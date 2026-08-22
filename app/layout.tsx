import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/auth/top-nav";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/search/CommandPalette";

export const metadata: Metadata = {
  title: "RoommateSphere | Find Flats & People You'll Love Living With",
  description: "Discover verified flats and compatible roommates with multi-vector lifestyle matching and zero brokerage fees."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#faf9f6] text-stone-900 antialiased font-sans">
        <div className="flex min-h-screen flex-col">
          <TopNav />
          <div className="flex-1">{children}</div>
          <Footer />
          <CommandPalette />
        </div>
      </body>
    </html>
  );
}
