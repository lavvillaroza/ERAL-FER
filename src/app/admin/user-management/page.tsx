"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarAdmin } from "@/app/components/app-sidebar-admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";

// You'll need to create these components separately
import { StudentTable } from "@/components/tables/student-table";
import { TeacherTable } from "@/components/tables/teacher-table";
import { AdminTable } from "@/components/tables/admin-table";

export default function UserManagementPage() {
  return (
    <SidebarProvider>
      <AppSidebarAdmin />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">User Management</BreadcrumbLink>
                </BreadcrumbItem>                
              </BreadcrumbList>              
            </Breadcrumb>   
          </div>
        </header>

        <div className="flex-1 p-6">
          <Card className="p-6">
            <Tabs defaultValue="students" className="w-full">
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
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
