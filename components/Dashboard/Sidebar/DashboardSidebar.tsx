"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import * as motion from "motion/react-client"
import Logo from "@/app/icon0.svg";
import type { Route } from "@/types/routes";
import DashboardNavigation from "./DashboardNavigation";
import NotificationsPopover from "./Notifications";
import Image from "next/image";
import Link from "next/link";
import {
  TbBuildingCommunity,
  TbCreditCardPay,
  TbReport,
  TbSettings
} from "react-icons/tb";
import { MdOutlineCardMembership } from "react-icons/md";
import { FcOvertime } from "react-icons/fc";
import { TiUserOutline } from "react-icons/ti";
import { BellIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import NavFooter from "./NavFooter";



// import { TeamSwitcher } from "./team-switcher";

const sampleNotifications = [
  {
    id: "1",
    avatar: "/avatars/01.png",
    fallback: "OM",
    text: "New order received.",
    time: "10m ago",
  },
  {
    id: "2",
    avatar: "/avatars/02.png",
    fallback: "JL",
    text: "Server upgrade completed.",
    time: "1h ago",
  },
  {
    id: "3",
    avatar: "/avatars/03.png",
    fallback: "HH",
    text: "New user signed up.",
    time: "2h ago",
  },
];

const user = {
  name: "Anuj",
  email: "anujnaruka28@gmail.com",
  avatar: "/avatars/01.png",
}

const dashboardRoutes: Route[] = [
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
        icon: <TiUserOutline className="size-4 dark:text-white" />
      },
      {
        title: "Notifications",
        link: "/admin/notifications",
        icon: <BellIcon className="size-4 dark:text-white" />
      },
    ],
  },
];

export default function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const path = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed
            ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
            : "flex-row items-center justify-between"
        )}
      >
        <Link
          href={` ${path.split("/").includes("admin") ? "/admin/dashboard" : "/dashboard"} `}
          className="flex items-center gap-2"
        >
          <Image src={Logo} alt="Logo" width={24} height={24} className="size-12" />
          {!isCollapsed && (
            <span className="font-semibold text-black dark:text-white">
              SSM
            </span>
          )}
        </Link>

        <motion.div
          key={isCollapsed ? "header-collapsed" : "header-expanded"}
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "flex-row md:flex-col-reverse" : "flex-row"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <NotificationsPopover notifications={sampleNotifications} />
          <SidebarTrigger />
        </motion.div>

      </SidebarHeader>

      <SidebarContent className="gap-4 px-2 py-4">
        <DashboardNavigation routes={dashboardRoutes} />
      </SidebarContent>
      <NavFooter user={user} />
    </Sidebar>
  );
}
