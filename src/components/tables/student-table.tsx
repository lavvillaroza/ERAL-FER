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
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define interface for the student type
interface Student {
  id: number;
  name: string;
  email: string;
  status: "Activated" | "Disabled" | "New Register";
  registrationDate: string;
}

const dummyStudents: Student[] = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@student.com",
    status: "Activated",
    registrationDate: "2024-03-01",
  },
  {
    id: 2,
    name: "Emily Brown",
    email: "emily@student.com",
    status: "New Register",
    registrationDate: "2024-03-15",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael@student.com",
    status: "Disabled",
    registrationDate: "2024-02-20",
  },
  {
    id: 4,
    name: "Sofia Rodriguez",
    email: "sofia@student.com",
    status: "Activated",
    registrationDate: "2024-03-10",
  },
];

export function StudentTable() {
  const [status, setStatus] = useState("all");
  const [students, setStudents] = useState<Student[]>(dummyStudents);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

  const filteredStudents = status === "all"
    ? students
    : students.filter(student => student.status.toLowerCase() === status.toLowerCase());

  const handleActivate = (studentId: number) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, status: "Activated" }
        : student
    ));
  };

  const handleDisable = (studentId: number) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, status: "Disabled" }
        : student
    ));
  };

  const handleDeleteClick = (studentId: number) => {
    setStudentToDelete(studentId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (studentToDelete) {
      setStudents(students.filter(student => student.id !== studentToDelete));
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
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
            <SelectItem value="all">All Students</SelectItem>
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
          {filteredStudents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                No records found
              </TableCell>
            </TableRow>
          ) : (
            filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      student.status === "Activated" ? "success" :
                      student.status === "Disabled" ? "destructive" : "warning"
                    }
                  >
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(student.registrationDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {student.status !== "Activated" && (
                        <DropdownMenuItem onClick={() => handleActivate(student.id)}>
                          Activate
                        </DropdownMenuItem>
                      )}
                      {student.status !== "Disabled" && (
                        <DropdownMenuItem onClick={() => handleDisable(student.id)}>
                          Disable
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(student.id)}
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
              Are you sure you want to delete this student? This action cannot be undone.
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