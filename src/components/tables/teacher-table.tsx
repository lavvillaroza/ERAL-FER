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

interface Teacher {
  id: number;
  name: string;
  email: string;
  status: "Activated" | "Disabled" | "New Register";
  registrationDate: string;
}

const dummyTeachers: Teacher[] = [
  {
    id: 1,
    name: "Prof. Sarah Smith",
    email: "smith@teacher.com",
    status: "Activated",
    registrationDate: "2024-03-01",
  },
  {
    id: 2,
    name: "Dr. James Wilson",
    email: "wilson@teacher.com",
    status: "New Register",
    registrationDate: "2024-03-15",
  },
  {
    id: 3,
    name: "Prof. Maria Garcia",
    email: "garcia@teacher.com",
    status: "Disabled",
    registrationDate: "2024-02-10",
  },
  {
    id: 4,
    name: "Dr. David Kim",
    email: "kim@teacher.com",
    status: "Activated",
    registrationDate: "2024-03-05",
  },
];

export function TeacherTable() {
  const [status, setStatus] = useState("all");
  const [teachers, setTeachers] = useState<Teacher[]>(dummyTeachers);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<number | null>(null);

  const filteredTeachers = status === "all"
    ? teachers
    : teachers.filter(teacher => teacher.status.toLowerCase() === status.toLowerCase());

  const handleActivate = (teacherId: number) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === teacherId 
        ? { ...teacher, status: "Activated" }
        : teacher
    ));
  };

  const handleDisable = (teacherId: number) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === teacherId 
        ? { ...teacher, status: "Disabled" }
        : teacher
    ));
  };

  const handleDeleteClick = (teacherId: number) => {
    setTeacherToDelete(teacherId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (teacherToDelete) {
      setTeachers(teachers.filter(teacher => teacher.id !== teacherToDelete));
      setDeleteDialogOpen(false);
      setTeacherToDelete(null);
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
            <SelectItem value="all">All Teachers</SelectItem>
            <SelectItem value="New Register">New Register</SelectItem>
            <SelectItem value="Activated">Activated</SelectItem>
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
          {filteredTeachers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                No records found
              </TableCell>
            </TableRow>
          ) : (
            filteredTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      teacher.status === "Activated" ? "success" :
                      teacher.status === "Disabled" ? "destructive" : "warning"
                    }
                  >
                    {teacher.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(teacher.registrationDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {teacher.status !== "Activated" && (
                        <DropdownMenuItem onClick={() => handleActivate(teacher.id)}>
                          Activate
                        </DropdownMenuItem>
                      )}
                      {teacher.status !== "Disabled" && (
                        <DropdownMenuItem onClick={() => handleDisable(teacher.id)}>
                          Disable
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(teacher.id)}
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