"use client";

import { BookCopy, LayoutDashboard, School } from "lucide-react";
import { NavMain } from "@/components/ui/nav-main";
import { NavUser } from "@/components/ui/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { UserModel } from "@/models/userModel";
import { useEffect, useState } from "react";
import { getUserByUserId } from "@/services/userAppService";

interface AppSidebarTeacherProps extends React.ComponentProps<typeof Sidebar> {
  userId: number;
}

export function AppSidebarTeacher({ userId, ...props }: AppSidebarTeacherProps) {  
  const [user, setUser] = useState<UserModel>({} as UserModel);
  const data = {
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
          },
        ],
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {                
        if (userId === 0)  return;    

        const response = await getUserByUserId(userId);

        if (!response.success) {
          throw new Error(response.message);
        }        
        setUser(response.data);          
      } catch (error) {
        console.log("Error fetching User:", error);       
      }         
    }
    fetchData();
  }, [userId]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BookCopy className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ERAL</span>
                  <span className="truncate text-xs">utilizing FER</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 rounded-lg p-2">
          <NavUser user={user} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
