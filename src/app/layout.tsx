import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "UniShare · Campus Sharing Platform",
  description:
    "UniShare — the complete campus sharing platform: marketplace rentals, ride sharing, token wallet, safety SOS and admin tools. 85 live screens.",
  keywords: ["UniShare", "campus", "rental", "marketplace", "ride sharing", "students"],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "UniShare · Campus Sharing Platform",
    description: "Marketplace rentals, rides, token wallet and safety tools for students.",
    siteName: "UniShare",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
