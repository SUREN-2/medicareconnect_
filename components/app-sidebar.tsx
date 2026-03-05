"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconBellPlus,
  IconUsers,
  IconLogout,
  IconArrowRightSquareFilled,
  IconHeartHandshake,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/use-Logout";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
      key: "user_dashboard",
    },

    {
      title: "Recent Activity",
      url: "#",
      icon: IconChartBar,
      key: "activity",
    },
    {
      title: "Calendar View",
      url: "#",
      icon: IconListDetails,
      key: "calendar",
    },
    {
      title: "Notification Settings",
      url: "#",
      icon: IconBellPlus,
      key: "settings",
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  onNavigate: (value: string) => void;
};

export function AppSidebar({ onNavigate, ...props }: AppSidebarProps) {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5 text-purple-700 !h:auto">
              <div className="w-6 h-6 flex items-center justify-center">
                <IconHeartHandshake className="w-full h-full text-purple-700" />
              </div>

              <span className="text-xl font-semibold text-brand-clr">
                Medicare Connect
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="curson-pointer !important"
                onClick={() => router.push("/patient")}
              >
                <IconArrowRightSquareFilled />
                <span>Patient</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem
                  key={item.key}
                  onClick={() => item.key && onNavigate?.(item.key)}
                >
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="cursor-pointer"
                  onClick={() => logout()}
                  disabled={isPending}
                >
                  <IconLogout />
                  <span>{isPending ? "Logging out..." : "Logout"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <NavMain items={data.navMain} /> */}
        {/* <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  );
}
