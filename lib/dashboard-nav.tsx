import type { Route } from "@/types/routes";
import {
    TbBuildingCommunity,
    TbCreditCardPay,
    TbReport,
    TbSettings,
    TbLayoutDashboard,
    TbLogout,
} from "react-icons/tb";
import { MdOutlineCardMembership, MdOutlineAdminPanelSettings } from "react-icons/md";
import { FcOvertime } from "react-icons/fc";
import { TiUserOutline } from "react-icons/ti";

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
                },
                {
                    title: "Notifications",
                    link: "/admin/notifications",
                },
            ],
        },
        {
            id: "logout",
            title: "Logout",
            icon: <TbLogout className="size-4" />,
            link: "/log-out",
        }
    ],
    resident: [
        {
            id: "user-dashboard",
            title: "Dashboard",
            icon: <TbLayoutDashboard className="size-4" />,
            link: "/dashboard",
        },
        {
            id: "subscriptions",
            title: "Subscriptions",
            icon: <MdOutlineCardMembership className="size-4" />,
            link: "/subscriptions",
        },
        {
            id: "profile",
            title: "Profile",
            icon: <TiUserOutline className="size-4" />,
            link: "/profile",
        },
        {
            id: "logout",
            title: "Logout",
            icon: <TbLogout className="size-4" />,
            link: "/log-out",
        }
    ],
};
