import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/auth/top-nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Roommate Sphere | Modern Flatmate & Room Discovery",
  description: "Find high-vibe roommates and designer living spaces tailored to your lifestyle energy."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased font-sans">
        <div className="flex min-h-screen flex-col">
          <TopNav />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

