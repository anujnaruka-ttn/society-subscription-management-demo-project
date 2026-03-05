import type { Metadata } from "next";
import { Alexandria, Aoboshi_One, DM_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const fontSans = Alexandria({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const fontSerif = Aoboshi_One({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",

});

const fontMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500"],

});

export const metadata: Metadata = {
  title: "Society Subscription Management",
  description: "Society Subscription Management is a web application designed to help manage and track subscriptions for various societies. It provides features such as subscription tracking, payment management, and member management to streamline the subscription process for society administrators and members.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased w-screen h-screen overflow-x-hidden overflow-y-auto
      flex justify-center-safe items-center-safe`}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}