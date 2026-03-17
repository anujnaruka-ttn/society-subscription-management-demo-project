"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import * as motion from "motion/react-client"
import Logo from "@/app/icon0.svg";
import DashboardNavigation from "./DashboardNavigation";
import NotificationsPopover from "./Notifications";
import Image from "next/image";
import Link from "next/link";
import NavFooter from "./NavFooter";
import { dashboardRoutes } from "@/lib/dashboard-nav";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";

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


export default function DashboardSidebar() {

  const { user } = useSelector((state: any) => state.auth);
  const { data: session } = useSession()
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isAdmin = user?.role === "admin";
  const routes = isAdmin ? dashboardRoutes.admin : dashboardRoutes.resident;


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
          href={` ${isAdmin ? "/admin/dashboard" : "/dashboard"} `}
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
        <DashboardNavigation routes={routes} />
      </SidebarContent>
      <NavFooter user={user || session?.user} />
    </Sidebar>
  );
}
