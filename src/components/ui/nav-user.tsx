"use client";

import { BookUserIcon, ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { logoutUser } from "@/services/authAppService"
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserModel } from "@/models/userModel";
import { GetFullName, GetIntialName } from "@/lib/fullName";
import  ManageAccount from "@/components/manage-account";

export function NavUser({ user }: { user: UserModel }) {  
  const { isMobile } = useSidebar()
  const router = useRouter();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);    
  const [isManageAccountOpen, setIsManageAccountOpen] = useState(false);
   // ✅ Handle logout
   const handleLogout = async () => {
    try {
      await logoutUser(); // Call the API logout function
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
    finally {
      setIsCancelDialogOpen(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.userDetails?.profile_image?.toString() ?? "/images/user.png"} alt={GetFullName(user.userDetails)} />
                <AvatarFallback className="rounded-lg">{GetIntialName(user.userDetails)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{GetFullName(user.userDetails)}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.userDetails?.profile_image?.toString() ?? "/images/user.png"} alt={GetFullName(user.userDetails)} />
                  <AvatarFallback className="rounded-lg">{GetIntialName(user.userDetails)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{GetFullName(user.userDetails)}</span>
                  <span className="truncate text-xs">{user.email}</span>                  
                </div>
              </div>
            </DropdownMenuLabel>                        
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsManageAccountOpen(true)}>
                <BookUserIcon />
                Manage Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsCancelDialogOpen(true)}>
              <LogOut />
                Log out                
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>        
      </SidebarMenuItem>
    </SidebarMenu>
    <ManageAccount
        isOpen={isManageAccountOpen}
        onClose={() => setIsManageAccountOpen(false)}
        user={user}
      />
    <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>          
      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmation Dialog</DialogTitle>
          <DialogDescription>   
            Are you sure you want to logout?         
          </DialogDescription>
        </DialogHeader>                    
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
              variant="outline" 
              type="button" 
              className="w-full sm:w-auto"
              onClick={() => setIsCancelDialogOpen(false)}>
            no
          </Button>
          <Button type="submit" variant="default" className="w-full sm:w-auto" onClick={handleLogout}>
            yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
