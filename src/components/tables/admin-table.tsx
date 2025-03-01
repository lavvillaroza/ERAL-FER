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
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Admin {
  id: number;
  name: string;
  email: string;
  status: "Activated" | "Disabled" | "New Register";
  registrationDate: string;
}

const dummyAdmins: Admin[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "New Register",
    registrationDate: "2024-03-01",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Activated",
    registrationDate: "2024-02-15",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "Disabled",
    registrationDate: "2024-01-20",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    status: "Activated",
    registrationDate: "2024-03-10",
  },
];

export function AdminTable() {
  const [status, setStatus] = useState("all");
  const [admins, setAdmins] = useState<Admin[]>(dummyAdmins);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);

  const filteredAdmins = status === "all"
    ? admins
    : admins.filter(admin => admin.status.toLowerCase() === status.toLowerCase());

  const handleActivate = (adminId: number) => {
    setAdmins(admins.map(admin => 
      admin.id === adminId 
        ? { ...admin, status: "Activated" }
        : admin
    ));
  };

  const handleDisable = (adminId: number) => {
    setAdmins(admins.map(admin => 
      admin.id === adminId 
        ? { ...admin, status: "Disabled" }
        : admin
    ));
  };

  const handleDeleteClick = (adminId: number) => {
    setAdminToDelete(adminId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (adminToDelete) {
      setAdmins(admins.filter(admin => admin.id !== adminToDelete));
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Select defaultValue="all" onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Admins</SelectItem>
            <SelectItem value="Activated">Activated</SelectItem>
            <SelectItem value="New Register">New Register</SelectItem>
            <SelectItem value="Disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAdmins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                No records found
              </TableCell>
            </TableRow>
          ) : (
            filteredAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      admin.status === "Activated" ? "success" :
                      admin.status === "Disabled" ? "destructive" : "warning"
                    }
                  >
                    {admin.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(admin.registrationDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {admin.status !== "Activated" && (
                        <DropdownMenuItem onClick={() => handleActivate(admin.id)}>
                          Activate
                        </DropdownMenuItem>
                      )}
                      {admin.status !== "Disabled" && (
                        <DropdownMenuItem onClick={() => handleDisable(admin.id)}>
                          Disable
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(admin.id)}
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
              Are you sure you want to delete this admin? This action cannot be undone.
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