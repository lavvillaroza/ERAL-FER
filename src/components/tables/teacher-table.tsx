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
import { UserModel } from "@/models/userModel";

export function TeacherTable() {
    const [status, setStatus] = useState("all");
    const [teachers, setTeachers] = useState<UserModel[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

  
    useEffect(() => {
        const fetchTeachers = async () => {
          try {
            const response = await getUsersByRole("teacher");
            if (!response.success) {
              throw new Error(response.message);
            }      
            setTeachers(response.data);        
          } catch (error) {
            setError(`Failed to fetch students: ${error}`);
          } finally {
            setLoading(false);
          }
        };
    
        fetchTeachers();
      }, []);

      const filteredTeachers = status === "all"
        ? teachers
        : teachers.filter(teacher => teacher.account_status.toLowerCase() === status.toLowerCase());
          
    
      const handleActivate = (studentId: number) => {
        setTeachers(teachers.map(teacher => 
          teacher.user_id === studentId 
            ? { ...teacher, status: "activated" }
            : teacher
        ));
      };
    
      const handleDisable = (studentId: number) => {
        setTeachers(teachers.map(teacher => 
          teacher.user_id === studentId 
            ? { ...teacher, status: "disabled" }
            : teacher
        ));
      };
    
      const handleDeleteClick = (studentId: number) => {
        setTeacherToDelete(studentId);
        setDeleteDialogOpen(true);
      };
    
      const handleDelete = () => {
        if (teacherToDelete) {
          setTeachers(teachers.filter(teacher => teacher.user_id !== teacherToDelete));
          setDeleteDialogOpen(false);
          setTeacherToDelete(null);
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
        {filteredTeachers && filteredTeachers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                No records found
              </TableCell>
            </TableRow>
          ) : (
            filteredTeachers?.map((teacher) => (
              <TableRow key={teacher.user_id}>
                <TableCell>{teacher.userDetails.first_name  + " " + teacher.userDetails.middle_name  + " " + teacher.userDetails.last_name}</TableCell>
                <TableCell>{teacher.userDetails.course}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      teacher.account_status === "activated" ? "success" :
                      teacher.account_status === "disabled" ? "destructive" : "warning"
                    }
                  >
                    {teacher.account_status}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(teacher.created_date), "yyyy-MM-dd")}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {teacher.account_status !== "activated" && (
                        <DropdownMenuItem onClick={() => handleActivate(teacher.user_id)}>
                          Activate
                        </DropdownMenuItem>
                      )}
                      {teacher.account_status !== "disabled" && (
                        <DropdownMenuItem onClick={() => handleDisable(teacher.user_id)}>
                          Disable
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(teacher.user_id)}
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