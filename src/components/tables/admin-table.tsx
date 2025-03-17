"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, UserRoundCheckIcon, UserRoundMinusIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getUsersByRole, updateUserStatusByUserId } from "@/services/userAppService";
import Loading from "@/components/loading";
import { format } from "date-fns";
import { UserModel } from "@/models/userModel";
import { AccountStatus } from "@/types/accountStatus";
import { toast, Toaster } from "sonner";

export function AdminTable() {
  const [status, setStatus] = useState("all");
  const [admins, setAdmins] = useState<UserModel[]>([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [adminToDisable, setAdminToDisable] = useState<number | null>(null);
  const [adminToActivate, setAdminToActivate]= useState<number | null>(null);

  const fetchAdmins = async () => {
    try {
      const response = await getUsersByRole("admin");
      if (!response.success) {
        throw new Error(response.message);
      }    
      setAdmins(response.data);        
    } catch (error) {
      setError(`Failed to fetch admins: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {   
    fetchAdmins();
  }, []);

  const filteredAdmins = status === "all"
    ? admins
    : admins.filter(admin => admin.account_status.toLowerCase() === status.toLowerCase());
  
  const handleActivate = (studentId: number) => {
      setAdminToActivate(studentId);    
      setActivateDialogOpen(true);
  };
  
  const handleDisable = (studentId: number) => {
    setAdminToDisable(studentId);
    setDisableDialogOpen(true);
  };

  const ActivateAdmin = async () => {
    if (!adminToActivate) return;
    try {
      const response = await updateUserStatusByUserId(adminToActivate, AccountStatus.ACTIVATED);
      if(!response.success) {
        throw new Error(response.message)
      }
      await fetchAdmins();
      toast.error("Activating Admin With UserId: " + adminToActivate, {
        description: "Successfully activated.",
      });
    }
    catch (error) {
      setError(`Failed to activate admin: ${error}`);
    }
    finally {
      setActivateDialogOpen(false);
    }
  }  
  const DisableAdmin = async () => {
    if (!adminToDisable) return;
    try {
      const response = await updateUserStatusByUserId(adminToDisable, AccountStatus.DISABLED);
      if(!response.success) {
        throw new Error(response.message)
      }
      await fetchAdmins();
      toast.error("Disabling Admin With UserId: " + adminToDisable, {
        description: "Successfully disabled.",
      });
    }
    catch (error) {
      setError(`Failed to disable admin: ${error}`);
    }
    finally {
      setDisableDialogOpen(false);
    }
  }  

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;    
  return (
    <div>
       <div className="flex items-center gap-4 mb-4">
        <Select defaultValue="all" onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teachers</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="activated">Activated</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {filteredAdmins && filteredAdmins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                No records found
              </TableCell>
            </TableRow>
          ) : (
            filteredAdmins?.map((admin) => (
              <TableRow key={admin.user_id}>
                <TableCell>{admin.userDetails.first_name  + " " + admin.userDetails.middle_name  + " " + admin.userDetails.last_name}</TableCell>
                <TableCell>{admin.userDetails.course}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      admin.account_status === "activated" ? "success" :
                      admin.account_status === "disabled" ? "destructive" : "warning"
                    }>
                    {admin.account_status}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(admin.created_date), "yyyy-MM-dd")}</TableCell>
                <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {admin.account_status !== "activated" && (
                        <DropdownMenuItem onClick={() => handleActivate(admin.user_id)}>
                          <UserRoundCheckIcon/> Activate
                        </DropdownMenuItem>
                      )}
                      {admin.account_status !== "disabled" && (
                        <DropdownMenuItem onClick={() => handleDisable(admin.user_id)}>
                          <UserRoundMinusIcon/> Disable
                        </DropdownMenuItem>
                      )}                      
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Dialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Disable</DialogTitle>
            <DialogDescription>
              Are you sure you want to disable this User?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDisableDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={DisableAdmin}>
              Disable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Activation</DialogTitle>
            <DialogDescription>
              Are you sure you want to Activate this User?.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActivateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={ActivateAdmin}>
              Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />

    </div>
  );
}