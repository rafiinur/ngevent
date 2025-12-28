import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthInitializer } from "@/components/auth";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NgEvent - RSVP Event Platform",
  description: "Buat dan kelola event dengan mudah. Dapatkan konfirmasi kehadiran melalui RSVP digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthInitializer>
          {children}
        </AuthInitializer>
      </body>
    </html>
  );
}
