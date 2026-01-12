import React from "react";
import type { Metadata } from "next";
import { Cairo } from "next/font/google"; // Using Cairo for Arabic
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";
import { SessionProvider } from "next-auth/react";
import AppFooter from "../components/footer";
import BtmNav from "../components/BtmNav";
import ScrollTop from "@/components/ScrollTop";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "لييبر بيتزا | أشهى أنواع البيتزا الإيطالية",
  description:
    "اطلب الآن أشهى أنواع البيتزا من لييبر بيتزا. طعم لا يقاوم، توصيل سريع، وجودة عالية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.className} antialiased flex flex-col transition-colors duration-300`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ScrollTop />
            <NavBar />
            <Toaster position="top-center" expand />
            <main className="w-full grow min-h-screen">{children}</main>
            <BtmNav />
            <AppFooter />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
