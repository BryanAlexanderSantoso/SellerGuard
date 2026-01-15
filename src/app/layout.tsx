import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SellerGuard | Secure Your Business",
  description: "Protect your MSME from return fraud with SellerGuard. Evidence tracking, blacklist database, and smooth verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <AccessibilityProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen pt-24 pb-12">
              {children}
            </main>
          </AuthProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
