import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter, per the Aquaphil design system — self-hosted via next/font.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Aquaphil Water Care",
  description: "Aquaphil Water Care — RO purifiers, service & AMC — all in one place.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f2f7fd",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0, minHeight: "100vh", fontFamily: "var(--font-inter)" }}>
        {children}
      </body>
    </html>
  );
}
