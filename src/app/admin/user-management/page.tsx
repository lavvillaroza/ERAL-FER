"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarAdmin } from "@/components/app-sidebar-admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";

// You'll need to create these components separately
import { StudentTable } from "@/components/tables/student-table";
import { TeacherTable } from "@/components/tables/teacher-table";
import { AdminTable } from "@/components/tables/admin-table";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getDecodedAuthToken, refreshAuthToken } from '@/services/authAppService'
import { toast, Toaster } from "sonner"

export default function UserManagementPage() {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const router = useRouter(); 
  const [userId, setUserId] = useState<number>(0);  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await getDecodedAuthToken();
        if (!token) {
          console.log("No auth token found.");
          toast.error("Failed to fetch class subjects!", {
            description: "No auth token found.",
          });
          router.push("/login");
          return; // Stop execution
        }
        const decodedToken = token.data;
        if (!decodedToken) {
          const refreshToken = await refreshAuthToken();
          if (!refreshToken || refreshToken.success === false) {
            router.push("/login");
          }
          setUserId(refreshToken.data.id);
        } else {
          setUserId(decodedToken.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/login");
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    setSelectedTab("students"); // Set after hydration
  }, []);  
  return (
    <SidebarProvider>
      <AppSidebarAdmin userId={userId}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/user-management">User Management</BreadcrumbLink>
                </BreadcrumbItem>                
              </BreadcrumbList>              
            </Breadcrumb>   
          </div>
          <div className="flex items-center space-x-4 px-4">
            <div className="relative">
              {/* <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
              </button> */}
            </div>
          </div>
        </header>        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <Card className="p-6">
            {selectedTab && ( // Render only after hydration
                <Tabs defaultValue={selectedTab} className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList>
                      <TabsTrigger value="students">Students</TabsTrigger>
                      <TabsTrigger value="teachers">Teachers</TabsTrigger>
                      <TabsTrigger value="admins">Admins</TabsTrigger>
                    </TabsList>
                    
                    <div className="admin-actions">
                      <TabsContent value="admins" className="m-0">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Admin
                        </Button>
                      </TabsContent>
                    </div>
                  </div>
                  <TabsContent value="students">
                    <StudentTable />
                  </TabsContent>
                  <TabsContent value="teachers">
                    <TeacherTable />
                  </TabsContent>
                  <TabsContent value="admins">
                    <AdminTable />
                  </TabsContent>
                </Tabs>
              )}
          </Card>
        </div>
        <Toaster />       
      </SidebarInset>
    </SidebarProvider>
  );
}
