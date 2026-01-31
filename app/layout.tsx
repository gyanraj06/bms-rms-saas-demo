import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const garamond = EB_Garamond({
    subsets: ["latin"],
    variable: "--font-garamond",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Demo BMS • Mounterra Innovations",
    description: "Premium Hotel Booking Management System",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${garamond.variable} antialiased`}
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    );
}
