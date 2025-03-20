"use client";
import { useState, useEffect } from "react";
import { AppSidebarTeacher } from "@/components/app-sidebar-teacher";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, ChevronRight, Plus, MoreHorizontal, Bell, CircleX, MergeIcon, ViewIcon, DoorOpenIcon, CircleXIcon } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ClassSubjectModel } from "@/models/classSubjectModel";
import { getClassSubjectById, updateClassSubjectStatus } from "@/services/classSubjectAppService";
import { ClassScheduleModel } from "@/models/classScheduleModel";
import { toast, Toaster } from "sonner";
import { createClassSchedule, getClassSchedules, updateClassScheduleStatus } from "@/services/classScheduleAppService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@radix-ui/react-separator";
import { ClassScheduleStatus } from "@/types/classScheduleStatus";
import { format } from "date-fns";
import Loading from "@/components/loading";
import CourseContentModal from "@/components/course-content-modal";
import { getDecodedAuthToken, refreshAuthToken } from "@/services/authAppService";
import { convertTo24HourFormat, formatTime } from "@/lib/formatTime";
import { ClassStatus } from "@/types/classStatus";
import { JSX } from "react/jsx-runtime";

const getStatusColor = (status: string) => {
  switch (status) {
    case "finished":
      return "bg-gray-500";
    case "upcoming":
      return "bg-blue-500";
    case "canceled":
      return "bg-red-500";
    default:
      return "bg-green-500";
  }
};

const SubjectDetails = () => {
  const router = useRouter();
  const [classSubject, setClassSubject] = useState<ClassSubjectModel>({} as ClassSubjectModel);
  const [classSchedules, setClassSchedules] = useState<ClassScheduleModel[]>([]);
  const [newSchedule, setNewSchedule] = useState<ClassScheduleModel>({
      id: 0, // Assume ID is auto-generated
      class_subject_id: 0, // Passed as prop
      date_schedule: "",
      time_start: "",
      time_end: "",
      status: "upcoming", // Default value
      topic_title: "",
      remarks: ""
    });

  const params = useParams();  
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);    
  const [isLoading, setIsLoading] = useState(true);
  const [openAddScheduleDialog, setOpenAddScheduleDialog] = useState(false);
  const [isEndClassDialogOpen, setIsEndClassDialogOpen] = useState(false);
  const [teacherUserId, setTeacherUserId] = useState<number>(0);
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
        const [resSubject, resSchedules] = await Promise.all([
          getClassSubjectById(Number(params.subject_id)),          
          getClassSchedules(Number(params.subject_id)),
        ]);

        if (!resSubject.success) {
            throw new Error(resSubject.message);
        }

        if (!resSchedules.success) {
          throw new Error(resSchedules.message);
      }      
        setClassSubject(resSubject.data);                  
        setClassSchedules(resSchedules.data);          
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

  const fetchSchedules = async (subjectId: number) => {
    try {
      const resSchedules = await getClassSchedules(subjectId);
      if (!resSchedules.success) {
        throw new Error(resSchedules.message);
      }
      setClassSchedules(resSchedules.data);
    } catch (error) {
      console.log("Error fetching class schedules:", error);
      toast.error("Failed to fetch class schedules!", {
        description: error instanceof Error ? error.message : JSON.stringify(error),
      });
    }
  };

  const openAddSchedule = () => {
    const [startTime, endTime] = classSubject.time_schedule.split(" - ");        
    setNewSchedule({
      id: 0,
      class_subject_id: 0,
      date_schedule: "",
      time_start: convertTo24HourFormat(startTime),
      time_end: convertTo24HourFormat(endTime),
      status: "upcoming",
      topic_title: "",
      remarks: "",      
    });
    setOpenAddScheduleDialog(true);    
  }  

  const openScheduleSession = async (schedule_id: number) => {
    const schedule = classSchedules.find(schedule => schedule.id === schedule_id);
    const currentDate = format(new Date().toLocaleDateString(), "yyyy-MM-dd");
    if (!schedule) {
      toast.error("Schedule not found!");
      return;
    }
    const schedDate = format(schedule.date_schedule, "yyyy-MM-dd");     

    if (currentDate > schedDate) {
      toast.error("Cannot connect!", {
        description: "The schedule has passed.",
      });
    }    
    else if (currentDate < schedDate) {
      toast.warning("Cannot connect!", {
        description: "The schedule is still upcoming.",
      });
    }
    else {      
      if (schedule.course_contents?.length === 0) { 
        toast.error("Cannot open!", {
          description: "The schedule should have a course contents.",
        });
      }
      const response = await updateClassScheduleStatus(Number(params.subject_id), schedule_id, ClassScheduleStatus.OPENED)      
      if (response.success) {        
        router.push(`/teacher/my-classes/current/class-details/${classSubject.id}/${schedule_id}`)      
      }
      else {
        toast.error("Error!", {
          description: `${response.data.message}`,
        });
      }      
    }
  }

  const joinScheduleSession = async (schedule_id: number) => {
    const schedule = classSchedules.find(schedule => schedule.id === schedule_id);
    if (!schedule) {
      toast.error("Schedule not found!");
      return;
    }
    const currentDate = format(new Date().toLocaleDateString(), "yyyy-MM-dd");
    const schedDate = format(schedule.date_schedule, "yyyy-MM-dd");     
    if (currentDate > schedDate) {
      toast.error("Cannot connect!", {
        description: "The schedule has passed.",
      });
    }    
    else if (currentDate < schedDate) {
      toast.warning("Cannot connect!", {
        description: "The schedule is still upcoming.",
      });
    }
    else {
        await router.push(`/teacher/my-classes/current/class-details/${classSubject.id}/${schedule_id}`)      
    }      
  }

  const viewScheduleSession = async (schedule_id: number) => {
    const schedule = classSchedules.find(schedule => schedule.id === schedule_id);
    if (!schedule) {
      toast.error("Schedule not found!");
      return;
    }
    await router.push(`/teacher/my-classes/current/class-details/${classSubject.id}/${schedule_id}/view`)      
  }

  const statusActions = (schedule: ClassScheduleModel) : Record<string, JSX.Element> => ({
    upcoming: (
      <div className="flex justify-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openScheduleSession(schedule.id)}>
                <DoorOpenIcon/> Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsCancelDialogOpen(true)}>
                <CircleXIcon/> Cancel
              </DropdownMenuItem>                        
          </DropdownMenuContent>
        </DropdownMenu>        
          <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>          
            <DialogContent className="max-w-sm sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cancel Class Schedule</DialogTitle>
                <DialogDescription>Please provide a reason for cancelling.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="cancellation-reason">Reason</Label>
                  <Textarea id="cancellation-reason" placeholder="Explain the cancellation" rows={4} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notify-students">Notify Students</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-students" defaultChecked />
                    <label htmlFor="notify-students" className="text-sm font-medium">
                      Send notification to all students
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button 
                    variant="outline" 
                    type="button" 
                    className="w-full sm:w-auto"
                    onClick={() => setIsCancelDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="destructive" className="w-full sm:w-auto">
                  Confirm Cancellation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="lg:hidden flex justify-center">
            <CourseContentModal schedule={schedule}/>
          </div>
      </div>
    ),
    opened: (
      <div className="flex justify-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">              
              <DropdownMenuItem onClick={() => joinScheduleSession(schedule.id)}>
                <MergeIcon/>Join
              </DropdownMenuItem>                        
          </DropdownMenuContent>
        </DropdownMenu>    
      </div>           
    ),
    finished: (
      <div className="flex justify-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">              
                <DropdownMenuItem onClick={() => viewScheduleSession(schedule.id)}>
                  <ViewIcon /> View
                </DropdownMenuItem>                        
            </DropdownMenuContent>
        </DropdownMenu>    
      </div>          
    ),
    cancelled: (
      <div className="flex justify-center gap-2">
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">              
              <DropdownMenuItem onClick={() => {}}>
                <DoorOpenIcon/> ReOpen
              </DropdownMenuItem>                        
          </DropdownMenuContent>
        </DropdownMenu>  
      </div>
       
    ),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewSchedule({ ...newSchedule, [e.target.id]: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setNewSchedule({ ...newSchedule, status: value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();    
    try {

      newSchedule.class_subject_id = classSubject.id;
      newSchedule.time_start = formatTime(newSchedule.time_start);
      newSchedule.time_end = formatTime(newSchedule.time_end);

      const response = await createClassSchedule(newSchedule)
      if (response.success) {
        toast.success(
          "New Schedule!",
          {
            description: response.message,
            className: "text-white bg-green-500" // Default color            
          }           
        );   
        // Reset form after successful submission
        setNewSchedule({
          id: 0,
          class_subject_id: 0,
          date_schedule: "",
          time_start: "",
          time_end: "",
          status: "upcoming",
          topic_title: "",
          remarks: "",          
        });
        setOpenAddScheduleDialog(false);
        const updatedSchedules = await getClassSchedules(Number(params.subject_id))
        if (updatedSchedules.success) {
          await fetchSchedules(Number(params.subject_id));
        }
        else {
          toast.error(
            "Retreiving Updated Schedules!",
            {
              description: response.message,
              className: "text-white bg-green-500" // Default color            
            }           
          ); 
        }
      }
      else {
        toast.error(
          "New Schedule!",
          {
            description: response.message,
            className: "text-white bg-green-500" // Default color            
          }           
        ); 
      }
      
    } catch (error) {
      console.error("Error adding schedule:", error);
      toast.error("Failed to fetch class subject!", {
        description: error instanceof Error ? error.message : JSON.stringify(error),
      });
    }
  };

  const handleEndClass = async () => { 
    const response = await updateClassSubjectStatus(Number(params.subject_id), ClassStatus.COMPLETED)      
    if (response.success) {        
      router.push(`/teacher/my-classes/current/class-details/${classSubject.id}`)      
    }
    else {
      toast.error("Error!", {
        description: `${response.data.message}`,
      });
    }      
  }
  return (
    <>
    <SidebarProvider>
      <AppSidebarTeacher userId={teacherUserId} />
      <SidebarInset>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 sticky top-0 bg-white z-10 px-4 sm:px-4 border-b">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">My Classes</BreadcrumbLink>
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
                            <BreadcrumbLink href={`/teacher/my-classes/current/class-details/${params.subject_id}`}>
                              Details
                            </BreadcrumbLink>
                        </BreadcrumbItem>         
                    </BreadcrumbList>              
                </Breadcrumb>            
            </div>          
            <div className="flex items-center">
                <div className="relative">
                    <button aria-label='bell' className="p-2 rounded-full hover:bg-gray-100">
                        <Bell className="w-6 h-6 text-gray-600" />
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
                    </button>
                </div>
            </div>
        </header>
        <div className="flex-1 p-2 sm:p-4">     
          {isLoading ? (
            <Loading/>
          ) :  (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-2">
                <div>   
                  <h1 className="text-base sm:text-2xl font-bold">
                     {classSubject.name ?? ""}                                          
                  </h1>
                  <pre className="mt-0 text-base text-gray-600">{`[ ${classSubject.days} ] ${classSubject.time_schedule}`}</pre>
                </div>
                <Button
                    variant="destructive"
                    size="sm" className="w-full sm:w-auto mr-6"
                    onClick={() => {console.log("End Session is clicked!")}}>
                    <CircleX className="h-4 w-4 mr-1" /> End Class
                </Button>
              </div>
                            
              <div className="flex flex-col gap-4 sm:gap-6">
                {/* Class Schedule Card */}
                <Card className="w-full">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl ">
                      <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
                      Class Schedule
                    </CardTitle>
                    <Dialog open={openAddScheduleDialog} onOpenChange={setOpenAddScheduleDialog}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full sm:w-auto" onClick={() => openAddSchedule()}>
                          <Plus className="h-4 w-4 mr-1" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Class Schedule</DialogTitle>
                          <DialogDescription>Enter the details for the new class schedule.</DialogDescription>
                        </DialogHeader>

                        {/* Form Submission */}
                        <form onSubmit={handleSubmit}>                          
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="date_schedule">Date</Label>
                              <Input id="date_schedule" type="date" value={newSchedule.date_schedule} onChange={handleChange} required />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="time_start">Start Time</Label>
                                <Input id="time_start" type="time" value={newSchedule.time_start} onChange={handleChange} required />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="time_end">End Time</Label>
                                <Input id="time_end" type="time" value={newSchedule.time_end} onChange={handleChange} required />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="status">Status</Label>
                              <Select value={newSchedule.status} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="upcoming">Upcoming</SelectItem>                                  
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="remarks">Topic Title</Label>
                              <Input id="topic_title" type="text" value={newSchedule.topic_title} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="remarks">Remarks</Label>
                              <Textarea id="remarks" placeholder="Add any additional notes" value={newSchedule.remarks} onChange={handleChange} />
                            </div>
                          </div>
                          <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button type="submit" className="w-full sm:w-auto">Save</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] sm:h-[400px] pr-4">
                      <div className="w-full overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="whitespace-nowrap">
                                Date
                              </TableHead>
                              <TableHead className="whitespace-nowrap hidden sm:table-cell">
                                Time
                              </TableHead>
                              <TableHead className="whitespace-nowrap">
                                Status
                              </TableHead>
                              <TableHead className="whitespace-nowrap hidden md:table-cell">
                                Remarks
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-center hidden lg:table-cell">
                                Course Content
                              </TableHead>
                              <TableHead className="whitespace-nowrap text-center">
                                Action
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                              {classSchedules.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} className="text-center text-gray-500">
                                    No records available
                                  </TableCell>
                                </TableRow>
                              ) : (
                                classSchedules
                                  .sort(
                                    (a, b) =>
                                      new Date(b.date_schedule).getTime() -
                                      new Date(a.date_schedule).getTime()
                                  )
                                  .map((schedule) => (
                                    <TableRow key={schedule.id}>
                                      <TableCell className="whitespace-nowrap">
                                        <div>
                                          {schedule.date_schedule}
                                          <div className="sm:hidden text-xs text-gray-500">
                                            {schedule.time_start + " - " + schedule.time_end}
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell className="whitespace-nowrap hidden sm:table-cell">
                                        {schedule.time_start + " - " + schedule.time_end}
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          variant="secondary"
                                          className={`${getStatusColor(schedule.status)} text-white whitespace-nowrap`}>
                                          {schedule.status}
                                        </Badge>                                        
                                      </TableCell>
                                      <TableCell className="max-w-[200px] truncate hidden md:table-cell">
                                        {schedule.remarks}
                                      </TableCell>
                                      <TableCell className="hidden lg:table-cell">
                                        <div className="flex justify-center">
                                          <CourseContentModal schedule={schedule}/>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        {statusActions(schedule)[schedule.status] || <p className="text-center text-gray-500">No actions available</p>}
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
      <Dialog open={isEndClassDialogOpen} onOpenChange={setIsEndClassDialogOpen}>          
      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmation Dialog</DialogTitle>
          <DialogDescription>   
            Are you sure you want to end this subject?         
          </DialogDescription>
        </DialogHeader>                    
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
              variant="outline" 
              type="button" 
              className="w-full sm:w-auto"
              onClick={() => setIsEndClassDialogOpen(false)}>
            no
          </Button>
          <Button type="submit" variant="default" className="w-full sm:w-auto" onClick={handleEndClass}>
            yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default SubjectDetails;
