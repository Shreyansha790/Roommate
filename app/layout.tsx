import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roommate App",
  description: "Find roommates and listings"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
