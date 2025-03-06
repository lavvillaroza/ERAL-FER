"use client"

import { useState, useEffect } from "react";
import { AppSidebarTeacher } from "@/app/components/app-sidebar-teacher";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription,  DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, ChevronRight, Bell, Search, Save, AlertCircle } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ExpressionCharts } from "@/components/expression-charts";
import { Input } from "@/components/ui/input";
import { ClassSubjectModel } from "@/models/classSubjectModel";
import { getClassSubjectById } from "@/services/classSubjectAppService";
import { ClassStudentModel } from "@/models/classStudentModel";
import { toast, Toaster } from "sonner";
import { addClassStudents, getClassStudents } from "@/services/classStudentAppService";
import { useParams } from "next/navigation";
import { Separator } from "@radix-ui/react-separator";
import { getUsersByRole } from "@/services/userAppService";
import { UserModel } from "@/models/userModel";
import { GetFullName } from "@/lib/fullName";

// type Expression = "Happy" | "Sad" | "Angry" | "Fearful" | "Disgusted" | "Surprised" | "Neutral";

// const getExpressionColor = (expression: Expression) => {
//   switch (expression) {
//     case "Happy":
//       return "text-green-500";
//     case "Sad":
//       return "text-purple-500";
//     case "Angry":
//       return "text-red-500";
//     case "Fearful":
//       return "text-slate-500";
//     case "Disgusted":
//       return "text-zinc-700";
//     case "Surprised":
//       return "text-orange-500";
//     default:
//       return "text-blue-500"; // Neutral
//   }
// };


const ViewStudents = () => {
    const [classSubject, setClassSubject] = useState<ClassSubjectModel>({} as ClassSubjectModel);
    const params = useParams();  
    const [isModalOpen, setIsModalOpen] = useState(false);  
    const [searchQuery, setSearchQuery] = useState("");
    const [currentStudents, setCurrentStudents] = useState<UserModel[]>([]);
    const [availableStudents, setAvailableStudents] = useState<UserModel[]>([]);    
    const [studentToRemove, setStudentToRemove] = useState<UserModel | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [classStudents, setClassstudents] = useState<ClassStudentModel[]> ([]);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);

  // const [classAttendance, setClassAttendance] = useState<ClassAttendanceModel[]>([]);
  // const [classStudentsFer, setClassStudentsFer] = useState<ClassStudentFERModel[]>([]);
  // const [classLessonPlan, setClassLessonPlan] = useState<ClassLessonPlanModel[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {                                    
        const [resSubject, resStudents, resAvailableStudents] = await Promise.all([
          getClassSubjectById(Number(params.subject_id)),
          getClassStudents(Number(params.subject_id)),          
          getUsersByRole("student"),
        ])        
        setClassSubject(resSubject);  
        setClassstudents(resStudents);         
        setAvailableStudents(resAvailableStudents);        
      } catch (error) {
        console.log("Error fetching class subject:", error);
        toast.error("Failed to fetch class subject!", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        });
      } 

    }
    fetchData();
  }, [params.subject_id]);
  

  const [moods, setMoods] = useState([
    {
      icon: "😲",
      percentage: "25.00",
      label: "Surprised",
      bgClass: "bg-gray-100/50",
      color: "text-orange-500",
    },
    {
      icon: "😊",
      percentage: "15.00",
      label: "Happy",
      bgClass: "bg-gray-100/50",
      color: "text-green-500",
    },
    {
      icon: "😐",
      percentage: "20.00",
      label: "Neutral",
      bgClass: "bg-gray-100/50",
      color: "text-blue-500",
    },
    {
      icon: "😢",
      percentage: "10.00",
      label: "Sad",
      bgClass: "bg-gray-100/50",
      color: "text-purple-500",
    },
    {
      icon: "🤢",
      percentage: "8.00",
      label: "Disgusted",
      bgClass: "bg-gray-100/50",
      color: "text-zinc-700",
    },
    {
      icon: "😡",
      percentage: "12.00",
      label: "Angry",
      bgClass: "bg-gray-100/50",
      color: "text-red-500",
    },
    {
      icon: "😨",
      percentage: "10.00",
      label: "Fearful",
      bgClass: "bg-gray-100/50",
      color: "text-slate-500",
    },
  ]);

  const [students] = useState([
    { id: 1, name: "Emma Wilson", dominantExpression: "Happy", average: 85 },
    {
      id: 2,
      name: "James Anderson",
      dominantExpression: "Neutral",
      average: 78,
    },
    { id: 3, name: "Sophia Garcia", dominantExpression: "Happy", average: 92 },
    { id: 4, name: "Lucas Martinez", dominantExpression: "Sad", average: 65 },
    {
      id: 5,
      name: "Olivia Thompson",
      dominantExpression: "Happy",
      average: 88,
    },
  ]);

  const handleDialogOpen = async (open: boolean) => {    
    if (open) {      
      try {
       
        // Use the fetched response directly (avoid waiting for state update)
        const getCurrentStudents = availableStudents.filter(student => 
          classStudents.some(classStudent => classStudent.student_id === student.user_id)
        );
        setCurrentStudents([...getCurrentStudents]);

      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch class subject!", {
            description: error instanceof Error ? error.message : JSON.stringify(error),
          });
      }

    }
    setIsModalOpen(open);
  };

  const handleSaveStudents = async () => {
    setIsSaving(true);    
    try {      
      const addedStudents = currentStudents.filter(student => 
          !classStudents.some(classStudent => classStudent.student_id === student.user_id)
      );

      const addedStudentsIntoClassStudents = addedStudents.map(user => ({
        id: 0,
        class_subject_id: Number(params.subject_id),
        student_id: user.user_id,
        student_details: user.userDetails}));          

      if (addedStudentsIntoClassStudents.length > 0) {        
        const saveCurrentStudents = async () => {
          try {
            const response = await addClassStudents(addedStudentsIntoClassStudents);                    
            toast.success(
              response.message,
              {
                description: `${response.count + " has been added."}`,
                className: "text-white bg-green-500" // Default color            
              }           
            );                 
          } catch (error) {
            console.log(error);
            toast.error("Failed to add class students!", {
                description: error instanceof Error ? error.message : JSON.stringify(error),
              });            
          }       
        };        
        await saveCurrentStudents();        
      }
      else {
        toast.warning(
          "No added student",
          {
            description: "no changes has been made.",
            className: "text-white bg-green-500" // Default color            
          }           
        );        
      }
      
      // Close the dialog
      setIsModalOpen(false);

    } catch (error) {
        console.log(error);        
        setError("Failed to save class students!");        
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStudents = availableStudents?.filter(
    (student) =>
      (student.userDetails?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.userDetails?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !currentStudents.some((selected) => selected.user_id === student.user_id)
  );

  const handleAddStudent = (student: UserModel) => {
    if (!currentStudents.some((selected) => selected.user_id === student.user_id)) {
      setCurrentStudents((prev) => [...prev, student]);
      setSearchQuery("");
    }
  };

  const handleRemoveInitiate = (student: UserModel) => {
    setStudentToRemove(student);
    setShowConfirmDialog(true);
  };

  const handleConfirmRemove = () => {
    if (studentToRemove) {
      setCurrentStudents((prev) => 
        prev.filter((student) => student.user_id !== studentToRemove.user_id)
      );
      setShowConfirmDialog(false);
      setStudentToRemove(null);
    }
  };

  return (
    <SidebarProvider>
        <AppSidebarTeacher />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 sticky top-0 bg-white z-10 px-2 sm:px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">My-Classes</BreadcrumbLink>
                                </BreadcrumbItem> 
                                <BreadcrumbSeparator>
                                    <ChevronRight className="h-4 w-4" />
                                </BreadcrumbSeparator> 
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/teacher/my-classes/current">
                                    Current
                                    </BreadcrumbLink>
                                </BreadcrumbItem>  
                                <BreadcrumbSeparator>
                                    <ChevronRight className="h-4 w-4" />
                                </BreadcrumbSeparator>   
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={"/teacher/my-classes/current/class-details/" + classSubject.id}>
                                    {classSubject.name}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>    
                                <BreadcrumbSeparator>
                                    <ChevronRight className="h-4 w-4" />
                                </BreadcrumbSeparator>   
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={"/teacher/my-classes/current/class-details/" + classSubject.id}>
                                    View Students
                                    </BreadcrumbLink>
                                </BreadcrumbItem>         
                            </BreadcrumbList>              
                        </Breadcrumb>            
                    </div>          
                    <div className="flex items-center">
                        <div className="relative">
                            <button aria-label='bell' className="p-2 rounded-full hover:bg-gray-100">
                                <Bell className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </header>
                <div className="flex-1 p-2 sm:p-4 pt-0">          
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold">
                            {classSubject?.name}                
                            </h1>              
                            <pre className="mt-2 text-sm text-gray-600">{classSubject.time_schedule + " [ " + classSubject.days + " ]"}</pre>
                        </div>    
                        <Dialog open={isModalOpen} onOpenChange={handleDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="default" className="">
                                    Update Student List
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Manage Students</DialogTitle>
                                <DialogDescription>
                                Add or remove students from {classSubject.name}
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid grid-cols-1 gap-6 mt-4">
                                {/* Current Students Section */}
                                <div className="bg-white rounded-lg border p-4">
                                <h3 className="text-lg font-semibold mb-4">Current Students</h3>
                                
                                {currentStudents.length === 0 ? (
                                    <p className="text-gray-500 italic">No students added yet</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-600">Course</th>                                
                                            <th className="px-4 py-2 text-left font-medium text-gray-600">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {currentStudents.map((student) => (
                                            <tr key={student.user_id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">{GetFullName(student.userDetails)}</td>
                                            <td className="px-4 py-3">{student.userDetails.course}</td>                                  
                                            <td className="px-4 py-3">
                                                <button 
                                                onClick={() => handleRemoveInitiate(student)}
                                                className="text-red-500 hover:text-red-700 font-medium"
                                                >
                                                Remove
                                                </button>
                                            </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    </div>
                                )}
                                </div>
                                
                                {/* Add Students Section */}
                                <div className="bg-white rounded-lg border p-4">
                                <h3 className="text-lg font-semibold mb-4">Add Students</h3>
                                
                                <div className="relative mb-4">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-full"
                                    />
                                </div>
                                
                                {filteredStudents.length === 0 ? (
                                    <p className="text-gray-500 italic">No matching students found</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-600">Course</th>                                
                                            <th className="px-4 py-2 text-left font-medium text-gray-600">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredStudents.map((student) => (
                                            <tr key={student.user_id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">{GetFullName(student.userDetails)}</td>
                                            <td className="px-4 py-3">{student.userDetails.course}</td>     
                                            <td className="px-4 py-3">
                                                <button 
                                                onClick={() => handleAddStudent(student)}
                                                className="text-green-500 hover:text-green-700 font-medium"
                                                >
                                                Add
                                                </button>
                                            </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    </div>
                                )}
                                </div>
                                
                                {/* Save Button */}
                                <div className="flex justify-end gap-2 mt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={handleSaveStudents}
                                    disabled={isSaving}
                                    className="gap-2">
                                    {isSaving ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-white"></div>
                                        Saving...
                                    </>
                                    ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </>
                                    )}
                                </Button>
                                </div>
                            </div>
                            </DialogContent>
                        </Dialog>                                    

                        {showConfirmDialog && (
                        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                            <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Confirm Removal</DialogTitle>
                                <DialogDescription>
                                Are you sure you want to remove {studentToRemove?.userDetails.first_name + " " + studentToRemove?.userDetails.middle_name + " " + studentToRemove?.userDetails.last_name} from this class?
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                variant="outline"
                                onClick={() => setShowConfirmDialog(false)}
                                >
                                Cancel
                                </Button>
                                <Button
                                variant="destructive"
                                onClick={handleConfirmRemove}
                                >
                                Remove
                                </Button>
                            </div>
                            </DialogContent>
                        </Dialog>
                        )}        
                    </div>
                    <div className="h-auto sm:h-[165px] mb-4">
                        <ExpressionCharts moods={moods} />
                    </div>

                    <div className="flex flex-col gap-4 sm:gap-6">
                        {/* Student List Card */}
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Student List
                                </CardTitle>
                            </CardHeader>
                            <CardContent>                                                                
                                <ScrollArea className="h-[300px] sm:h-[400px] pr-4">
                                    <div className="w-full overflow-auto">
                                        <Table>
                                            <TableHeader>
                                            <TableRow>
                                                <TableHead className="whitespace-nowrap">
                                                Name
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap">
                                                Dominant Expression
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap">
                                                Average
                                                </TableHead>
                                            </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                            {students.map((student) => (
                                                <TableRow key={student.id}>
                                                <TableCell className="whitespace-nowrap">
                                                    {student.name}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    {student.dominantExpression}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    {student.average}%
                                                </TableCell>
                                                </TableRow>
                                            ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>                             
                    </div>
                </div>
            <Toaster />
            {/* Notification */}
            {showError && (
                <div className="fixed top-6 right-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md flex items-center z-50">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>{error}</p>
                </div>
              )}
        </SidebarInset>
    </SidebarProvider>    
  );
};

export default ViewStudents;
