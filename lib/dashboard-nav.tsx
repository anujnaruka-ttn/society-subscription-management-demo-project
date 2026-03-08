import type { Route } from "@/types/routes";
import {
    TbBuildingCommunity,
    TbCreditCardPay,
    TbReport,
    TbSettings,
    TbLayoutDashboard,
    TbHistory
} from "react-icons/tb";
import { MdOutlineCardMembership, MdOutlineAdminPanelSettings } from "react-icons/md";
import { FcOvertime } from "react-icons/fc";
import { TiUserOutline } from "react-icons/ti";
import { BellIcon } from "lucide-react";

export const dashboardRoutes: { admin: Route[]; resident: Route[] } = {
    admin: [
        {
            id: "admin-dashboard",
            title: "Dashboard",
            icon: <MdOutlineAdminPanelSettings className="size-4" />,
            link: "/admin/dashboard",
        },
        {
            id: "flats",
            title: "Flats",
            icon: <TbBuildingCommunity className="size-4" />,
            link: "/admin/flats",
        },
        {
            id: "subscriptions",
            title: "Subscriptions",
            icon: <MdOutlineCardMembership className="size-4" />,
            link: "/admin/subscriptions",
        },
        {
            id: "monthly-records",
            title: "Monthly Records",
            icon: <FcOvertime className="size-4" />,
            link: "/admin/monthly-records",
        },
        {
            id: "payment-entry",
            title: "Payment Entry",
            icon: <TbCreditCardPay className="size-4" />,
            link: "/admin/payment-entry",
        },
        {
            id: "reports",
            title: "Reports",
            icon: <TbReport className="size-4" />,
            link: "/admin/reports",
        },
        {
            id: "settings",
            title: "Settings",
            icon: <TbSettings className="size-4" />,
            link: "/admin/profile",
            subs: [
                {
                    title: "Profile",
                    link: "/admin/profile",
                    icon: <TiUserOutline className="size-4 dark:text-white" />,
                },
                {
                    title: "Notifications",
                    link: "/admin/notifications",
                    icon: <BellIcon className="size-4 dark:text-white" />,
                },
            ],
        },
    ],
    resident: [
        {
            id: "user-dashboard",
            title: "Dashboard",
            icon: <TbLayoutDashboard className="size-4" />,
            link: "/dashboard",
        },
        {
            id: "payment-history",
            title: "Payment History",
            icon: <TbHistory className="size-4" />,
            link: "/payment-history",
        },
        {
            id: "settings",
            title: "Settings",
            icon: <TbSettings className="size-4" />,
            link: "/profile",
            subs: [
                {
                    title: "Profile",
                    link: "/profile",
                    icon: <TiUserOutline className="size-4 dark:text-white" />,
                },
                {
                    title: "Notifications",
                    link: "/notifications",
                    icon: <BellIcon className="size-4 dark:text-white" />,
                },
            ],
        },
    ],
};
