"use client"

import { useState, useEffect } from "react";
import { AppSidebarTeacher } from "@/components/app-sidebar-teacher";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription,  DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, ChevronRight, Search, Save, BadgePlus, BadgeX } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { ClassSubjectModel } from "@/models/classSubjectModel";
import { getClassSubjectById } from "@/services/classSubjectAppService";
import { ClassStudentModel } from "@/models/classStudentModel";
import { toast, Toaster } from "sonner";
import { addClassStudents, getClassStudents } from "@/services/classStudentAppService";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@radix-ui/react-separator";
import { getUsersDetailsByRole } from "@/services/userAppService";
import { GetFullName } from "@/lib/fullName";
import { UserRole } from "@/types/userRole";
import { UserDetailsModel } from "@/models/userDetailsModel";
import Loading from "@/components/loading";
import { ExpressionChartsComplete } from "@/components/expression-charts-complete";
import { getDecodedAuthToken, refreshAuthToken } from "@/services/authAppService";
import { getFERChartDataBySubjectId, getFERStudentsDataBySubjectId } from "@/services/classStudentFerAppService";

import { classStudentFERAggStudentsDataModel } from "@/models/classStudentFERAggStudentsDataModel";
import { ClassStudentFERAggStudentModel } from "@/models/classStudentFERAggStudentModel";

const ViewStudents = () => {  
  const router = useRouter();
  const params = useParams();  
  const [classSubject, setClassSubject] = useState<ClassSubjectModel>({} as ClassSubjectModel);    
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [searchQuery, setSearchQuery] = useState("");
    
  const [currentStudents, setCurrentStudents] = useState<UserDetailsModel[]>([]);
  const [availableStudents, setAvailableStudents] = useState<UserDetailsModel[]>([]);        
  const [classStudents, setClassstudents] = useState<ClassStudentModel[]> ([]);

  const [studentToRemove, setStudentToRemove] = useState<UserDetailsModel | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);  
  const [isLoading, setIsLoading] = useState(true);  
  const [teacherUserId, setTeacherUserId] = useState<number>(0);
  const [studentList, setStudentList] = useState<ClassStudentFERAggStudentModel[]>([]);
  const [classStudentFerData, setClassStudentFerData] = useState<classStudentFERAggStudentsDataModel[]>([]);
  const [moods, setMoods] = useState([
    { icon: "😲", percentage: "0.00", label: "Surprised", bgClass: "bg-gray-100/50", color: "text-orange-500" },
    { icon: "😊", percentage: "0.00", label: "Happy", bgClass: "bg-gray-100/50", color: "text-green-500" },
    { icon: "😐", percentage: "0.00", label: "Neutral", bgClass: "bg-gray-100/50", color: "text-blue-500" },
    { icon: "😢", percentage: "0.00", label: "Sad", bgClass: "bg-gray-100/50", color: "text-purple-500" },
    { icon: "🤢", percentage: "0.00", label: "Disgusted", bgClass: "bg-gray-100/50", color: "text-zinc-700" },
    { icon: "😡", percentage: "0.00", label: "Angry", bgClass: "bg-gray-100/50", color: "text-red-500" },
    { icon: "😨", percentage: "0.00", label: "Fearful", bgClass: "bg-gray-100/50", color: "text-slate-500" },
    { icon: "😶", percentage: "0.00", label: "NA", bgClass: "bg-gray-100/50", color: "hsl(0, 0%, 50%)" },
  ]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await getDecodedAuthToken();
        if (!token) {
          console.log("No auth token found.");
          toast.error("Failed to fetch class subjects!", {
            description: "No auth token found.",
          });
          router.push("/login");
          return; // Stop execution
        }
        const decodedToken = token.data; 
        if (!decodedToken) {
          const refreshToken = await refreshAuthToken();
          if (!refreshToken || refreshToken.success === false) {
            router.push("/login");
          }
          setTeacherUserId(refreshToken.data.id);
        }
        else {
          setTeacherUserId(decodedToken.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/login");
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {        
    const fetchData = async () => {
      try {                                    
        const [responseSubject, responseStudents, responseStudentList, responseExpression, responseExpressionPerStudent] = await Promise.all([
          getClassSubjectById(Number(params.subject_id)),
          getClassStudents(Number(params.subject_id)),          
          getUsersDetailsByRole(UserRole.STUDENT),
          getFERChartDataBySubjectId(Number(params.subject_id)), 
          getFERStudentsDataBySubjectId(Number(params.subject_id))
        ]); 
        
        if (!responseSubject.success) throw new Error(responseSubject.message);
        if (!responseStudents.success) throw new Error(responseStudents.message);
        if (!responseStudentList.success) throw new Error(responseStudentList.message);
        if (!responseExpression.success) throw new Error(responseExpression.message);
        if (!responseExpressionPerStudent.success) throw new Error(responseExpressionPerStudent.message);

        setClassSubject(responseSubject.data);  
        setClassstudents(responseStudents.data);                 
        setAvailableStudents(responseStudentList.data);
        if (responseExpression.data) {          
          setMoods((prevMoods) => {
            const newMoods =  responseExpression.data[0] || {};            
            const updatedMoods = prevMoods.map((mood) => {
              const moodKey = mood.label.toLowerCase().trim(); // Trim extra spaces
              const moodValue = newMoods[moodKey];
              return {
                ...mood,
                percentage: moodValue ? Number(moodValue).toFixed(2) : "0.00",
              };
            });        
            return updatedMoods;
          });          
        }
        setClassStudentFerData(responseExpressionPerStudent.data);

      } catch (error) {
        console.log("Error fetching class subject:", error);
        toast.error("Failed to fetch class subject!", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        });
      }  
      finally {
        setIsLoading(false);
      }     
    }    
    fetchData();    
  }, [params.subject_id]);
  
  useEffect(() => {
    const getStudentList = mapFERDataToStudents(classStudents, classStudentFerData)
    setStudentList(getStudentList);    
  }, [classStudents, classStudentFerData]); // ✅ Logs moods only when updated
  
    const mapFERDataToStudents = (
      classStudents: ClassStudentModel[],
      ferData: classStudentFERAggStudentsDataModel[]
    ): (ClassStudentFERAggStudentModel & { ferData?: classStudentFERAggStudentsDataModel })[] => {
      return classStudents.map(student => {
        const dominantExpression = getDominantExpression(ferData.find(fer => fer.student_user_id === student.student_id) ?? {} as classStudentFERAggStudentsDataModel);
        
        return {
          id: student.student_details.user_id,
          full_name: GetFullName(student.student_details),
          course: student.student_details.course || "", // Provide a default value for null
          dominantExpression: String(dominantExpression.expression || "NONE"),
          average: Number(dominantExpression.value) || 0,    
        };
      });
    };

  const getDominantExpression = (ferData: classStudentFERAggStudentsDataModel) => {
      if (!ferData) {
        return { expression: "NONE", value: 0 };
      }
      const emotions = {
        surprised: ferData.surprised,
        happy: ferData.happy,
        neutral: ferData.neutral,
        sad: ferData.sad,
        angry: ferData.angry,
        disgusted: ferData.disgusted,
        fearful: ferData.fearful,
        na: ferData.na
      };
      
      // Extract emotion values (explicitly ensuring numbers)
      const emotionEntries = Object.entries(emotions).map(([key, value]) => [key, Number(value)]);

      // Find the dominant expression with the highest value
      const [dominant_expression, highest_avg_value] = emotionEntries.reduce(
        (max, [emotion, value]) => (value > max[1] ? [emotion, value] : max),
        ["na", 0] // Default to "na" if all values are 0
      );            
      return { expression: dominant_expression, value: highest_avg_value };
    };

  const fetchUpdatedClassStudents = async () => {
    try {
      const responseStudents = await getClassStudents(Number(params.subject_id));
      if (responseStudents.success === false) {
        throw new Error(responseStudents.message);
      }
      setClassstudents(responseStudents.data);         
    }
    catch (error) {
      console.log("Error fetching class subject:", error);
        toast.error("Failed to fetch class subject!", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        });
    }
  }

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
      const addedStudentsIntoClassStudents: ClassStudentModel[] = currentStudents.map(userDetails => ({
        id: 0,
        class_subject_id: Number(params.subject_id),
        student_id: userDetails.user_id,
        student_details: userDetails}));          

      if (addedStudentsIntoClassStudents.length > 0) {        
        const saveCurrentStudents = async () => {
          try {
            const response = await addClassStudents(Number(params.subject_id), addedStudentsIntoClassStudents);
            toast.success(
              response.message,
              {
                description: "Class Students has been updated.",
                className: "text-white bg-green-500" // Default color            
              }           
            );                 
          } catch (error) {
            console.log(`Saving ${error}`);
            toast.error("Failed to add class students!", {
                description: error instanceof Error ? error.message : JSON.stringify(error),
              });            
          }       
        };        
        await saveCurrentStudents();
        await fetchUpdatedClassStudents();
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
        toast.error(
          "Failed to save class students!",
          {
            description: `${error}`,
            className: "text-white bg-green-500" // Default color            
          }           
        );               
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStudents = availableStudents?.filter(
    (student) =>
      (student?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       student?.middle_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       student?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !currentStudents.some((selected) => selected.user_id === student.user_id)
  );

  const handleAddStudent = (student: UserDetailsModel) => {
    if (!currentStudents.some((selected) => selected.user_id === student.user_id)) {
      setCurrentStudents((prev) => [...prev, student]);
      setSearchQuery("");
    }
  };

  const handleRemoveInitiate = (student: UserDetailsModel) => {
    setStudentToRemove(student);
    setShowConfirmDialog(true);
  };

  const handleConfirmRemove = () => {
    if (studentToRemove) {
      console.log("before");
      console.log(currentStudents);
      setCurrentStudents((prev) => {
          const updatedStudents = prev.filter((student) => student.user_id !== studentToRemove.user_id);
          console.log("filtered students:", updatedStudents); // Logs the correct filtered list
          return updatedStudents;
        }        
      );
      setShowConfirmDialog(false);
      setStudentToRemove(null);      
    }
  };

  return (
    <SidebarProvider>
        <AppSidebarTeacher userId={teacherUserId}/>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 sticky top-0 bg-white z-10 px-2 sm:px-4 border-b">
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
                                    <BreadcrumbLink href={"/teacher/my-classes/current/view-students/" + classSubject.id}>
                                      View Students
                                    </BreadcrumbLink>
                                </BreadcrumbItem>         
                            </BreadcrumbList>              
                        </Breadcrumb>            
                    </div>          
                    <div className="flex items-center">
                        <div className="relative">
                            {/* <button aria-label='bell' className="p-2 rounded-full hover:bg-gray-100">
                                <Bell className="w-6 h-6 text-gray-600" />
                            </button> */}
                        </div>
                    </div>
                </header>
                <div className="flex-1 p-2 sm:p-4 pt-0">    
                   {isLoading ? (
                              <Loading/>
                    ) :  (
                      <>
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
                                  
                                  { currentStudents.length === 0 ? (                                    
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
                                                <td className="px-4 py-3">{GetFullName(student)}</td>
                                                <td className="px-4 py-3">{student.course}</td>                                  
                                                <td className="px-4 py-3">
                                                    <Button 
                                                      onClick={() => handleRemoveInitiate(student)}
                                                      variant="outline" size="icon"
                                                      className="text-red-500 hover:text-red-700 font-medium">
                                                      <BadgeX />
                                                    </Button>
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
                                                  <td className="px-4 py-3">{GetFullName(student)}</td>
                                                  <td className="px-4 py-3">{student.course}</td>     
                                                  <td className="px-4 py-3">
                                                      <Button 
                                                        onClick={() => handleAddStudent(student)}
                                                        variant="outline" size="icon">
                                                          <BadgePlus />                                                        
                                                      </Button>
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
                                    Are you sure you want to remove {studentToRemove?.first_name + " " + studentToRemove?.middle_name + " " + studentToRemove?.last_name} from this class?
                                  </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-2 mt-4">
                                  <Button
                                    variant="outline"
                                    onClick={() => setShowConfirmDialog(false)}>
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={handleConfirmRemove}>
                                    Remove
                                  </Button>
                              </div>
                              </DialogContent>
                          </Dialog>
                          )}        
                      </div>
                      <div className="h-auto sm:h-[165px] mb-4">
                          <ExpressionChartsComplete moods={moods} />                                                                       
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
                                                      Course
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
                                                {studentList.length === 0 ? (
                                                     <TableRow>
                                                      <TableCell colSpan={4} className="text-gray-500 italic text-center py-4">
                                                        No matching students found
                                                      </TableCell>
                                                    </TableRow>                                                   
                                                ) : (
                                                      studentList.map((student) => (
                                                      <TableRow key={student.id}>
                                                        <TableCell className="whitespace-nowrap">
                                                            {student.full_name}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            {student.course}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            {student.dominantExpression}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            {student.average}
                                                        </TableCell>
                                                      </TableRow>
                                                  ))
                                                )}                                                
                                              </TableBody>
                                          </Table>
                                      </div>
                                  </ScrollArea>
                              </CardContent>
                          </Card>                             
                      </div>                      
                      </>
                    )}                    
                </div>
            <Toaster />            
        </SidebarInset>
    </SidebarProvider>    
  );
};

export default ViewStudents;
