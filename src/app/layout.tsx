import type { Metadata } from "next";
import { Geist, Geist_Mono,Anuphan } from "next/font/google";
import "./globals.css";
import TopMenu from "../components/TopMenu";
import NextAuthProvider from "@/providers/NextAuthProvider";
import ReduxProvider from "@/providers/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anuphan = Anuphan({
  variable: "--font-anuphan",
  subsets:["thai"],
})

export const metadata: Metadata = {
  title: "Hotel Explorer",
  description: "Book your hotel easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${anuphan.variable}`}>
        <NextAuthProvider>
          <ReduxProvider>
            <TopMenu />
            {children}
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
