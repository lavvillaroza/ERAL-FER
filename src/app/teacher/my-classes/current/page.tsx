"use client";
import { AppSidebarTeacher } from "@/app/components/app-sidebar-teacher"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, Search } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SubjectCard, Subject } from "@/components/subject-card-current"

interface Student {
  id: number;
  name: string;
  grade: string;
  section: string;
}

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    time: "",
    image: ""
  });

  const availableStudents = [
    { id: 1, name: "Emma Wilson", grade: "Grade 10", section: "A" },
    { id: 2, name: "James Anderson", grade: "Grade 10", section: "B" },
    { id: 3, name: "Sophia Garcia", grade: "Grade 10", section: "A" },
    { id: 4, name: "Lucas Martinez", grade: "Grade 10", section: "C" },
    { id: 5, name: "Olivia Thompson", grade: "Grade 10", section: "B" },
    { id: 6, name: "William Lee", grade: "Grade 10", section: "A" },
  ];

  const subjects: Subject[] = [
    {
      id: 1,
      title: "Computer Programming 1",
      code: "CRP-2002024",
      time: "8:00AM - 10:00AM",
      instructor: "John Doe",
      instructorimage: "/images/user.png",
      image: "/images/subject-image.png",
      status: "ongoing",
      teacherId: "teacher123",
      classId: "D-CP-103",
      isScheduled: false
    },
  ];

  const filteredStudents = availableStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedStudents.some((selected) => selected.id === student.id)
  );

  const handleAddStudent = (student: Student) => {
    if (!selectedStudents.some((selected) => selected.id === student.id)) {
      setSelectedStudents((prev) => [...prev, student]);
      setSearchQuery("");
    }
  };

  const handleRemoveStudent = (studentId: number) => {
    setSelectedStudents((prev) => 
      prev.filter((student) => student.id !== studentId)
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add your submission logic here
      console.log("Form Data:", formData);
      console.log("Selected Students:", selectedStudents);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsOpen(false);
      setFormData({
        title: "",
        code: "",
        time: "",
        image: ""
      });
      setSelectedStudents([]);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebarTeacher />
      <SidebarInset>
        <header className="flex flex-col h-16 mt-4 shrink-0 items-start gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href='/teacher'>My Classes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href='/teacher/my-classes/current'>Current</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex justify-between items-center px-4 mt-4 w-full">
            <h1 className="text-2xl font-bold">List of Subjects</h1>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add a new subject to your classes.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Computer Programming 1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Description</Label>
                    <Input
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="e.g. CRP-2002024"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Schedule</Label>
                    <Input
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      placeholder="e.g. 8:00AM - 10:00AM"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="students">Student Attendees</Label>
                    {/* Selected Students */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedStudents.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                        >
                          <span className="text-sm">{student.name}</span>
                          <button
                            aria-label='bell'
                            type="button"
                            onClick={() => handleRemoveStudent(student.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        type="text"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full"
                      />
                    </div>
                    {/* Display Filtered Students */}
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <div
                            key={student.id}
                            className="p-2 border rounded hover:bg-secondary cursor-pointer"
                            onClick={() => handleAddStudent(student)}
                          >
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">
                              {student.grade} - Section {student.section}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-2">No students found.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add Subject"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="w-[100%] px-4">
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-8">
              {subjects.map(subject => (
                <SubjectCard 
                  key={subject.id} 
                  subject={subject} 
                  variant="teacher"
                  onViewStudents={() => {
                    // Handle view students logic here
                  }}
                />
              ))}
            </div>
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}