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
import { useEffect, useState } from "react";
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
import { getUsersByRole } from "@/services/userAppService";
import Loading from "@/components/loading";
import { format } from "date-fns";
import { UserModel } from "@/models/userModel";

export function StudentTable() {
  const [status, setStatus] = useState("all");
  const [students, setStudents] = useState<UserModel[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getUsersByRole("student");
        if (!response.success) {
          throw new Error(response.message);
        }                
        setStudents(response.data);        
      } catch (error) {        
        setError(`Failed to fetch students: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = status === "all"
    ? students
    : students.filter(student => student.account_status.toLowerCase() === status.toLowerCase());

  const handleActivate = (studentId: number) => {
    setStudents(students.map(student => 
      student.user_id === studentId 
        ? { ...student, status: "activated" }
        : student
    ));
  };

  const handleDisable = (studentId: number) => {
    setStudents(students.map(student => 
      student.user_id === studentId 
        ? { ...student, status: "disabled" }
        : student
    ));
  };

  const handleDeleteClick = (studentId: number) => {
    setStudentToDelete(studentId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (studentToDelete) {
      setStudents(students.filter(student => student.user_id !== studentToDelete));
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
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
            <SelectItem value="all">All Students</SelectItem>
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
          {filteredStudents && filteredStudents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                No records found
              </TableCell>
            </TableRow>
          ) : (
            filteredStudents?.map((student) => (
              <TableRow key={student.user_id}>
                <TableCell>{student.userDetails.first_name  + " " + student.userDetails.middle_name  + " " + student.userDetails.last_name}</TableCell>
                <TableCell>{student.userDetails.course}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      student.account_status === "activated" ? "success" :
                      student.account_status === "disabled" ? "destructive" : "warning"
                    }
                  >
                    {student.account_status}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(student.created_date), "yyyy-MM-dd")}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {student.account_status !== "activated" && (
                        <DropdownMenuItem onClick={() => handleActivate(student.user_id)}>
                          Activate
                        </DropdownMenuItem>
                      )}
                      {student.account_status !== "disabled" && (
                        <DropdownMenuItem onClick={() => handleDisable(student.user_id)}>
                          Disable
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(student.user_id)}
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