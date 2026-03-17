import type { Metadata } from "next";
import { Alexandria, Aoboshi_One, DM_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Navbar from "@/components/common/Navbar";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/components/providers/StoreProvider";

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
    openGraph: {
        type: "website",
        url: "https://society-subscription-management-dem.vercel.app/",
        siteName: "SSM",
        images: [
            {
                url: "/assets/og-image.png",
                width: 1200,
                height: 630,
                alt: "SSM",
            },
        ],
    },
    metadataBase: new URL("https://society-subscription-management-dem.vercel.app/"),
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en" suppressHydrationWarning>

            <head>
                <meta name="apple-mobile-web-app-title" content="SSM - Society Subscription Management" />
            </head>

            <body className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased w-screen h-screen overflow-x-hidden overflow-y-auto
            flex flex-col items-center-safe`}>
                <StoreProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <TooltipProvider>
                            <Navbar />
                            <main className="w-full h-full flex justify-center-safe items-center-safe">
                                {children}
                            </main>
                            <Toaster
                                richColors
                                expand
                                position="top-right"
                                swipeDirections={["right"]}
                            />
                        </TooltipProvider>
                    </ThemeProvider>
                </StoreProvider>
            </body>
        </html>
    );
}