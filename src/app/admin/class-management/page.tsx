'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { AppSidebarAdmin } from "@/app/components/app-sidebar-admin"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import AddClassForm from './components/AddClassForm'
import CurrentClasses from './components/CurrentClasses'
import CompletedClasses from './components/CompletedClasses'

export default function ClassManagement() {
  return (
    <SidebarProvider>
      <AppSidebarAdmin />
      <SidebarInset>
        <header className="flex flex-col h-16 mt-4 shrink-0 items-start gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Class Management</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="w-[100%] px-4">
            <h1 className="text-2xl font-bold mb-6">Class Management</h1>
            
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
                <Card className="p-6">
                  <CurrentClasses />
                </Card>
              </TabsContent>

              <TabsContent value="completed-classes">
                <Card className="p-6">
                  <CompletedClasses />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
