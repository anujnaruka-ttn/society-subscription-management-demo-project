import type { Metadata } from "next";
import "@/app/globals.css";
import { headers } from "next/headers";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import DashboardLayoutClient from "@/components/Dashboard/DashboardLayoutClient";

export async function generateMetadata(): Promise<Metadata> {

    const referer = (await headers()).get("referer");
    const currentRoute = referer
        ?.split("/")
        ?.splice(3, 4)
        ?.map(route => route.charAt(0).toUpperCase() + route.slice(1))
        ?.join(" ");

    const metadata: Metadata = {
        title: `SSM | ${currentRoute}`,
        description: `
                Society Subscription Management is a web application designed to help manage 
                and track subscriptions for various societies. 
                It provides features such as subscription tracking, payment management, 
                and member management to streamline the subscription process for society administrators and members.
            `,
        metadataBase: new URL("https://ssm-ttn-demo-project.vercel.app"),
    }

    return {
        ...metadata,
        openGraph: {
            ...metadata,
            type: "website",
            url: "https://ssm-ttn-demo-project.vercel.app",
            siteName: "SSM",
            images: [
                {
                    url: "/public/assets/og-image.png",
                    width: 300,
                    height: 250,
                    alt: "SSM",
                },
            ],
        } as OpenGraph
    }

}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <DashboardLayoutClient>
            {children}
        </DashboardLayoutClient>
    );
}