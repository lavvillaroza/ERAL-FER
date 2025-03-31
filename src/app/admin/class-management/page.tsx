'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { AppSidebarAdmin } from "@/components/app-sidebar-admin"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import AddClassForm from '@/app/admin/class-management/components/add-new-class'
import CurrentClasses from '@/app/admin/class-management/components/current-classes'
import CompletedClasses from '@/app/admin/class-management/components/completed-classes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getDecodedAuthToken, refreshAuthToken } from '@/services/authAppService'
import { toast, Toaster } from "sonner"
import { ScrollArea } from '@/components/ui/scroll-area'

export default function ClassManagement() {  
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
  
  return (
    <SidebarProvider>
      <AppSidebarAdmin userId={userId} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/class-management">Class Management</BreadcrumbLink>
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
          <div className="w-[100%] px-4">            
            <Tabs defaultValue="add-class">
              <TabsList>
                <TabsTrigger value="add-class">Add New Class</TabsTrigger>
                <TabsTrigger value="current-classes">Current Classes</TabsTrigger>
                <TabsTrigger value="completed-classes">Completed Classes</TabsTrigger>
              </TabsList>
              <TabsContent value="add-class">
                <Card className="p-6">
                  <AddClassForm />
                </Card>
              </TabsContent>
              <TabsContent value="current-classes">
                <Card className="p-6 h-auto min-h-[770px] md:h-[770px] sm:h-auto">
                  <ScrollArea className="h-[700px] pr-4">
                    <CurrentClasses />
                  </ScrollArea>                                    
                </Card>
              </TabsContent>
              <TabsContent value="completed-classes">
                <Card className="p-6 h-auto min-h-[770px] md:h-[770px] sm:h-auto">
                  <ScrollArea className="h-[700px] pr-4">
                      <CompletedClasses />
                  </ScrollArea>                  
                </Card>
              </TabsContent>
            </Tabs>
          </div>    
        </div>       
        <Toaster />       
      </SidebarInset>      
    </SidebarProvider>
  )
}
