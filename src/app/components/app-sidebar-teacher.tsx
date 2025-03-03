"use client";

import { useRouter } from 'next/navigation';
import * as React from "react"
import {
  BookCopy,
  LayoutDashboard,
  School,
} from "lucide-react"
import { NavMain } from "@/components/ui/nav-main"
import { NavUser } from "@/components/ui/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/teacher",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "My Classes",
      url: "#",
      icon: School,
      items: [
        {
          title: "Completed",
          url: "/teacher/my-classes/completed",
        },
        {
          title: "Current",
          url: "/teacher/my-classes/current",
        }
      ],
    }
  ]
}

export function AppSidebarTeacher({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const handleProfileClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    router.push('teacher/profile');
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BookCopy className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ERAL</span>
                  <span className="truncate text-xs">utilizing FER</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div
          onClick={handleProfileClick}
          className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 rounded-lg p-2"
        >
          <NavUser user={data.user} />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}