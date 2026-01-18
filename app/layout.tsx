import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AuthInitializer } from "@/features/auth/components";
import { Header, Footer } from "@/components/layout";

const plusJakartaSans = Plus_Jakarta_Sans({
	variable: "--font-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Ngevent - RSVP Event Platform",
	description:
		"Buat dan kelola event dengan mudah. Dapatkan konfirmasi kehadiran melalui RSVP digital.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="id" suppressHydrationWarning>
			<body className={`${plusJakartaSans.variable} font-sans antialiased`}>
				<AuthInitializer>
					<Header />
					<main className="min-h-screen">{children}</main>
					<Footer />
				</AuthInitializer>
			</body>
		</html>
	);
}
