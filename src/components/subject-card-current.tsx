/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Search, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Subject {
  id: number;
  title: string;
  code: string;
  time: string;
  instructor: string;
  instructorimage: string;
  image: string;
  status: string;
  classId: string;
  teacherId?: string;
  isScheduled: boolean;
}

interface SubjectCardProps {
  subject: Subject;
  variant: "student" | "teacher";
  onViewStudents?: () => void;
}

interface Student {
  id: number;
  name: string;
  grade: string;
  section: string;
  course?: string;
}

export const SubjectCard = ({ subject, variant, onViewStudents }: SubjectCardProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentStudents, setCurrentStudents] = useState<Student[]>([
    { id: 7, name: "Anna Brown", grade: "Grade 10", section: "A" },
    { id: 8, name: "Michael Chen", grade: "Grade 10", section: "B" },
    { id: 9, name: "Sarah Johnson", grade: "Grade 10", section: "C" },
  ]);
  const [originalStudents, setOriginalStudents] = useState<Student[]>([]);
  const [studentToRemove, setStudentToRemove] = useState<Student | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const availableStudents = [
    { id: 1, name: "Emma Wilson", grade: "Grade 10", section: "A" },
    { id: 2, name: "James Anderson", grade: "Grade 10", section: "B" },
    { id: 3, name: "Sophia Garcia", grade: "Grade 10", section: "A" },
    { id: 4, name: "Lucas Martinez", grade: "Grade 10", section: "C" },
    { id: 5, name: "Olivia Thompson", grade: "Grade 10", section: "B" },
    { id: 6, name: "William Lee", grade: "Grade 10", section: "A" },
  ];

  const filteredStudents = availableStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !currentStudents.some((selected) => selected.id === student.id)
  );

  const handleAddStudent = (student: Student) => {
    if (!currentStudents.some((selected) => selected.id === student.id)) {
      setCurrentStudents((prev) => [...prev, student]);
      setSearchQuery("");
    }
  };

  const handleRemoveInitiate = (student: Student) => {
    setStudentToRemove(student);
    setShowConfirmDialog(true);
  };

  const handleConfirmRemove = () => {
    if (studentToRemove) {
      setCurrentStudents((prev) => 
        prev.filter((student) => student.id !== studentToRemove.id)
      );
      setShowConfirmDialog(false);
      setStudentToRemove(null);
    }
  };

  const handleJoin = () => {
    const basePath = variant === "student" ? "/student" : "/teacher";
    router.push(`${basePath}/my-classes/current/${variant === "student" ? subject.classId : subject.teacherId}`);
  };

  const handleDialogOpen = (open: boolean) => {
    if (open) {
      // Store original students to allow cancellation
      setOriginalStudents([...currentStudents]);
    } else {
      // Reset to original if dialog is closed without saving
      setCurrentStudents([...originalStudents]);
    }
    setIsModalOpen(open);
  };

  const handleSaveStudents = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update original students with current selection
      setOriginalStudents([...currentStudents]);
      
      // Show success toast or notification
      console.log("Students saved successfully:", currentStudents);
      
      // Close the dialog
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving students:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const checkIfCurrentTime = (timeRange: string) => {
    const [start, end] = timeRange.split(' - ');
    const now = new Date();
    
    const startTime = new Date();
    const endTime = new Date();
    
    // Handle AM/PM conversion
    const startParts = start.match(/(\d+):?(\d+)?([AP]M)/);
    const endParts = end.match(/(\d+):?(\d+)?([AP]M)/);
    
    if (!startParts || !endParts) return false;
    
    let startHour = parseInt(startParts[1]);
    if (startParts[3] === 'PM' && startHour !== 12) startHour += 12;
    if (startParts[3] === 'AM' && startHour === 12) startHour = 0;
    
    let endHour = parseInt(endParts[1]);
    if (endParts[3] === 'PM' && endHour !== 12) endHour += 12;
    if (endParts[3] === 'AM' && endHour === 12) endHour = 0;
    
    startTime.setHours(startHour, parseInt(startParts[2] || '0'), 0);
    endTime.setHours(endHour, parseInt(endParts[2] || '0'), 0);
    
    return now >= startTime && now <= endTime;
  };

  const isCurrentTime = checkIfCurrentTime(subject.time);
  const isJoinable = subject.isScheduled && isCurrentTime;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={subject.image}
            alt={subject.title}
            className="w-full h-48 rounded-2xl object-cover"
          />
          <button 
            onClick={handleJoin}
            disabled={!isJoinable}
            className={`absolute top-3 right-3 ${
              isJoinable ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
            } text-white font-bold px-3 py-1 rounded-full text-sm transition-colors`}
          >
            Join
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold mb-2">
            {subject.title} - {subject.code}
          </h3>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock size={16} className="mr-2" />
            {subject.time}
          </div>
          <div className="flex items-center mt-3">
            <img 
              src={subject.instructorimage}
              alt={subject.instructor}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-600">{subject.instructor}</span>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline" 
              className="flex-1"
              onClick={() => router.push(`/${variant}/my-classes/current/subjectDetails`)}
            >
              Details
            </Button>
            {variant === "teacher" && (
              <Dialog open={isModalOpen} onOpenChange={handleDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    View Students
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Manage Students</DialogTitle>
                    <DialogDescription>
                      Add or remove students from {subject.title}
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
                                <th className="px-4 py-2 text-left font-medium text-gray-600">Grade</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600">Section</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentStudents.map((student) => (
                                <tr key={student.id} className="border-b hover:bg-gray-50">
                                  <td className="px-4 py-3">{student.name}</td>
                                  <td className="px-4 py-3">{student.grade}</td>
                                  <td className="px-4 py-3">Section {student.section}</td>
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
                                <th className="px-4 py-2 text-left font-medium text-gray-600">Grade</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600">Section</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredStudents.map((student) => (
                                <tr key={student.id} className="border-b hover:bg-gray-50">
                                  <td className="px-4 py-3">{student.name}</td>
                                  <td className="px-4 py-3">{student.grade}</td>
                                  <td className="px-4 py-3">Section {student.section}</td>
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
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleSaveStudents}
                        disabled={isSaving}
                        className="gap-2"
                      >
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
            )}

            {showConfirmDialog && (
              <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Confirm Removal</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to remove {studentToRemove?.name} from this class?
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
        </div>
      </CardContent>
    </Card>
  );
};