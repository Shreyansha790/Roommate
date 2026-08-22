import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/auth/top-nav";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/search/CommandPalette";

export const metadata: Metadata = {
  title: "Roommate Sphere | Cyber-Cartographic Roommate Discovery",
  description: "High-precision roommate and flat discovery engine powered by multi-vector lifestyle telemetry and spatial radar."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#05070a] text-slate-100 antialiased font-sans">
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
