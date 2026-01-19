import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google"; // Import serif font
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "EcomGuard | Secure Your Business",
  description: "Protect your MSME from return fraud with EcomGuard. Evidence tracking, blacklist database, and smooth verification.",
  icons: {
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Va3g2Wvn8XjWW8fvqHg4Wfuy6jCMgKNpsA&s",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sourceSerif.variable} font-sans antialiased`} suppressHydrationWarning>
        <AccessibilityProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen pt-24 pb-12 bg-[var(--background)] text-[var(--foreground)]">
              {children}
            </main>
          </AuthProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
