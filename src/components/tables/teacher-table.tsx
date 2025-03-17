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
import { MoreHorizontal, UserRoundCheckIcon, UserRoundMinusIcon } from "lucide-react";
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
import { getUsersByRole, updateUserStatusByUserId } from "@/services/userAppService";
import Loading from "@/components/loading";
import { format } from "date-fns";
import { UserModel } from "@/models/userModel";
import { AccountStatus } from "@/types/accountStatus";
import { toast, Toaster } from "sonner";

export function TeacherTable() {
  const [status, setStatus] = useState("all");
  const [teachers, setTeachers] = useState<UserModel[]>([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [teacherToDisable, setTeacherToDisable] = useState<number | null>(null);
  const [teacherToActivate, setTeacherToActivate]= useState<number | null>(null);

  const fetchTeachers = async () => {
    try {
      const response = await getUsersByRole("teacher");
      if (!response.success) {
        throw new Error(response.message);
      }      
      setTeachers(response.data);        
    } catch (error) {
      setError(`Failed to fetch teachers: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {      
      fetchTeachers();
    }, []);

  const filteredTeachers = status === "all"
    ? teachers
    : teachers.filter(teacher => teacher.account_status.toLowerCase() === status.toLowerCase());
      
  const handleActivate = (studentId: number) => {
    setTeacherToActivate(studentId);    
    setActivateDialogOpen(true);
  };
  
  const handleDisable = (studentId: number) => {
    setTeacherToDisable(studentId);
    setDisableDialogOpen(true);
  };

  const ActivateTeacher = async () => {
    if (!teacherToActivate) return;
    try {
      const response = await updateUserStatusByUserId(teacherToActivate, AccountStatus.ACTIVATED);
      if(!response.success) {
        throw new Error(response.message)
      }
      await fetchTeachers();
      toast.error("Activating Teacher With UserId: " + teacherToActivate, {
        description: "Successfully activated.",
      });
    }
    catch (error) {
      setError(`Failed to activate teacher: ${error}`);
    }
    finally {
      setActivateDialogOpen(false);
    }
  }  
  const DisableTeacher = async () => {
    if (!teacherToDisable) return;
    try {
      const response = await updateUserStatusByUserId(teacherToDisable, AccountStatus.DISABLED);
      if(!response.success) {
        throw new Error(response.message)
      }
      await fetchTeachers();
      toast.error("Disabling Teacher With UserId: " + teacherToDisable, {
        description: "Successfully disabled.",
      });
    }
    catch (error) {
      setError(`Failed to disable teacher: ${error}`);
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
                    <DropdownMenuContent align="start">
                      {teacher.account_status !== "activated" && (
                        <DropdownMenuItem onClick={() => handleActivate(teacher.user_id)}>
                          <UserRoundCheckIcon/> Activate
                        </DropdownMenuItem>
                      )}
                      {teacher.account_status !== "disabled" && (
                        <DropdownMenuItem onClick={() => handleDisable(teacher.user_id)}>
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
              Are you sure you want to disable this student?
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
              onClick={DisableTeacher}>
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
              Are you sure you want to Activate this student?.
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
              onClick={ActivateTeacher}>
              Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}