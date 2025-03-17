"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserRoundCheckIcon, UserRoundMinusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getUsersByRole, updateUserStatusByUserId } from "@/services/userAppService";
import Loading from "@/components/loading";
import { format } from "date-fns";
import { UserModel } from "@/models/userModel";
import { AccountStatus } from "@/types/accountStatus";
import { toast, Toaster } from "sonner";

export function StudentTable() {
  const [status, setStatus] = useState("all");
  const [students, setStudents] = useState<UserModel[]>([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [studentToDisable, setStudentToDisable] = useState<number | null>(null);
  const [studentToActivate, setStudentToActivate]= useState<number | null>(null);

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

  useEffect(() => {    
    fetchStudents();
  }, []);

  const filteredStudents = status === "all"
    ? students
    : students.filter(student => student.account_status.toLowerCase() === status.toLowerCase());

  const handleActivate = (studentId: number) => {
    setStudentToActivate(studentId);    
    setActivateDialogOpen(true);
  };
  
  const handleDisable = (studentId: number) => {
    setStudentToDisable(studentId);
    setDisableDialogOpen(true);
  };

  const ActivateStudent = async () => {
    if (!studentToActivate) return;
    try {
      const response = await updateUserStatusByUserId(studentToActivate, AccountStatus.ACTIVATED);
      if(!response.success) {
        throw new Error(response.message)
      }
      await fetchStudents();
      toast.error("Activating Student With UserId:" + studentToActivate, {
        description: "Successfully activated.",
      });
    }
    catch (error) {
      setError(`Failed to activate student: ${error}`);
    }
    finally {
      setActivateDialogOpen(false);
    }
  }

  const DisableStudent = async () => {
    if (!studentToDisable) return;
    try {
      const response = await updateUserStatusByUserId(studentToDisable, AccountStatus.DISABLED);
      if(!response.success) {
        throw new Error(response.message)
      }
      await fetchStudents();
      toast.error("Disabling Student With UserId:" + studentToActivate, {
        description: "Successfully disabled.",
      });
    }
    catch (error) {
      setError(`Failed to disable student: ${error}`);
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
                    <DropdownMenuContent align="start">
                      {student.account_status !== "activated" && (
                        <DropdownMenuItem onClick={() => handleActivate(student.user_id)}>
                          <UserRoundCheckIcon/> Activate
                        </DropdownMenuItem>
                      )}
                      {student.account_status !== "disabled" && (
                        <DropdownMenuItem onClick={() => handleDisable(student.user_id)}>
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
              onClick={DisableStudent}>
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
              onClick={ActivateStudent}>
              Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}