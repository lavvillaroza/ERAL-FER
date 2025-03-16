"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUsersByRole } from "@/services/userAppService";
import Loading from "@/components/loading";
import { format } from "date-fns";

// Define interface for the student type
interface Admin {
  user_id: number;
  email: string;
  role: string;  
  account_status: "activated" | "disabled" | "new";
  created_date: Date;
  userDetails: {
    first_name: string;
    middle_name: string | null;
    last_name: string;
    course: string;
    online_status: "online" | "offline";
    profile_image: string;
    thresh_hold: number;
  };
}

export function AdminTable() {
    const [status, setStatus] = useState("all");
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

  
    useEffect(() => {
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
    
        fetchAdmins();
      }, []);

      const filteredAdmins = status === "all"
        ? admins
        : admins.filter(admin => admin.account_status.toLowerCase() === status.toLowerCase());
          
    
      const handleActivate = (studentId: number) => {
        setAdmins(admins.map(admin => 
          admin.user_id === studentId 
            ? { ...admin, status: "activated" }
            : admin
        ));
      };
    
      const handleDisable = (userId: number) => {
        setAdmins(admins.map(admin => 
          admin.user_id === userId 
            ? { ...admin, status: "disabled" }
            : admin
        ));
      };
    
      const handleDeleteClick = (studentId: number) => {
        setAdminToDelete(studentId);
        setDeleteDialogOpen(true);
      };
    
      const handleDelete = () => {
        if (adminToDelete) {
          setAdmins(admins.filter(admin => admin.user_id !== adminToDelete));
          setDeleteDialogOpen(false);
          setAdminToDelete(null);
        }
      };
    
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
                    }
                  >
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
                    <DropdownMenuContent align="end">
                      {admin.account_status !== "activated" && (
                        <DropdownMenuItem onClick={() => handleActivate(admin.user_id)}>
                          Activate
                        </DropdownMenuItem>
                      )}
                      {admin.account_status !== "disabled" && (
                        <DropdownMenuItem onClick={() => handleDisable(admin.user_id)}>
                          Disable
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(admin.user_id)}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this teacher? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}