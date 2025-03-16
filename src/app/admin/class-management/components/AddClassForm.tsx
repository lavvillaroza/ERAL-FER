'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ClassSubjectModel } from '@/models/classSubjectModel'
import { getUsersByRole } from '@/services/userAppService'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createClassSubject } from '@/services/classSubjectAppService'
import { toast, Toaster } from "sonner"
import { ClassStatus } from '@/types/classStatus'
import { UserModel } from '@/models/userModel'

export default function AddClassForm() {    
  const [teachers, setTeachers] = useState<UserModel[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [classSubject, setClassSubject] =  useState<ClassSubjectModel>({
        id: 0,        
        name: '',
        description: '',
        start_date: null, // Prevent SSR mismatch
        end_date: null,   
        time_schedule: '',
        days: '',
        teacher_user_id: 0,
        status: ClassStatus.CURRENT
  });  
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [teacher, setTeacher] = useState<string | null>(null);  
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getUsersByRole("teacher");        
        if (!response.success) {
          throw new Error(response.message);
        }        
        setTeachers(response.data);

      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch teachers!", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        });        
      } 
    };
    fetchTeachers();
  }, []);

  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const days = ['M', 'T', 'W', 'TH', 'F', 'S']

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    
    setClassSubject((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

   // Handle date changes
   const handleDateChange = (key: 'start_date' | 'end_date', date: Date) => {

    setClassSubject((prev) => ({
      ...prev,
      [key]:  date,
    }));
  };

  // Handle select change for teacher
  const handleTeacherChange = (value: string) => {
    setTeacher(value);
    setClassSubject((prev) => ({
      ...prev,
      teacher_user_id: Number(value),
    }));
  };

  // Handle schedule days
  const handleDayChange = (day: string, checked: boolean) => {
    const updatedDays = checked
      ? [...selectedDays, day]
      : selectedDays.filter((d) => d !== day);

    setSelectedDays(updatedDays);
    setClassSubject((prev) => ({
      ...prev,
      days: updatedDays.join(','),
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmDialogOpen(true); // Open confirmation dialog
  };

  // Final confirmation to create class
  const handleConfirmCreateClass = async () => {
    try {      
      const response = await createClassSubject(classSubject);
      if (!response.success) {     
        throw new Error(response.message);
      }
      setClassSubject({
        id: 0,
        name: "",
        description: "",
        start_date: null,
        end_date: null,
        time_schedule: "",
        days: "",
        teacher_user_id: 0,
        status: ClassStatus.CURRENT,
      });
      
      setSelectedDays([]); // Clear selected checkboxes
      setStartTime(null);  // ✅ Reset start time select
      setEndTime(null);    // ✅ Reset end time select        
      setTeacher(null);

      setConfirmDialogOpen(false);
      toast.success(
        "Class successfully created!",
        {
          description: `${response.data.name + " is created."}`,
          className: "text-white bg-green-500" // Default color            
        }           
      );       
      
    } catch (error) {
      console.log(error);
      setConfirmDialogOpen(false);
      toast.error("Failed to create class!", {
        description: error instanceof Error ? error.message : JSON.stringify(error),
      });        
    }
  };
  
  // Convert 12-hour format to 24-hour for comparison
  const convertTo24Hour = (time: string) => {
    const match = time.match(/(\d+):(\d+)(AM|PM)/);
    if (!match) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, hour, minutes, period] = match;
    let hour24 = parseInt(hour, 10);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;
    return hour24 * 60 + parseInt(minutes, 10); // Convert to total minutes
  };

  // Function to convert 24-hour time to 12-hour format with AM/PM
  const formatTime = (time: string) => {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = (hour % 12 || 12).toString().padStart(2, "0"); // Ensures two-digit hour format
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

   // Function to update time_schedule when both values are selected
   const handleTimeChange = (type: "start" | "end", value: string) => {
    setClassSubject((prev) => {
      const formattedTime = formatTime(value);
  
      // Ensure time_schedule exists before updating
      if (!prev.time_schedule && type === "end") {
        toast.error("Invalid input.", {
          description: "Please select start time first!",
        });          
        return prev;
      }
  
      // Update individual time states
      if (type === "start") {
        setStartTime(value);
      } else {
        setEndTime(value);
      }
  
      // Construct new schedule correctly
      const [start, end] = prev.time_schedule.split(" - ");
      const newSchedule =
        type === "start"
          ? `${formattedTime} - ${end || ""}`
          : `${start || ""} - ${formattedTime}`;
  
      // Validate start and end time
      const startMinutes = convertTo24Hour(start?.trim() || "");
      const endMinutes = convertTo24Hour(formattedTime.trim());
  
      if (startMinutes !== null && endMinutes !== null && startMinutes >= endMinutes) {
        toast.error("Invalid start time.", {
          description: "Start time must be earlier than end time.",
        });                  
        return prev;
      }      
      return { ...prev, time_schedule: newSchedule.trim() };
    });
  };
  

  return (
    <div>
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-2">Name of Class</label>
        <Input
          type="text"
          name="name"
          placeholder="Enter class name"
          value={classSubject.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block mb-2">Description</label>
        <Textarea
          name="description"
          placeholder="Enter class description"
          value={classSubject.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="w-[50%]">
        <label className="block mb-2">Date Schedule</label>
        <div className="flex gap-2">
          <DatePicker value={classSubject.start_date  ?? undefined} onChange={(date) => handleDateChange('start_date', date as Date) } />
          <DatePicker value={classSubject.end_date  ?? undefined} onChange={(date) => handleDateChange('end_date', date as Date) } />          
        </div>
      </div>
      <div className="w-[50%]">
          <label className="block mb-2">Time Schedule</label>          
          <div className="flex gap-2">
            {/* Start Time Select */}
            <Input id="time_start" type="time" value={startTime ?? ""} onChange={(e) => handleTimeChange("start", e.target.value)} required />

            {/* End Time Select */}
            <Input id="time_end" type="time" value={endTime ?? ""} onChange={(e) => handleTimeChange("end", e.target.value)} required />              
          </div>
          {/* Debugging: Show Updated State (Optional) */}
          {/* <pre className="mt-2 text-sm text-gray-600">{classSubject.time_schedule}</pre> */}
      </div>
      <div>
        <label className="block mb-2">Schedule Days</label>
        <div className="flex gap-4">
          {days.map((day) => (
            <div key={day} className="flex items-center">
            <Checkbox
              id={day}
              checked={selectedDays.includes(day)}
              onCheckedChange={(checked) => handleDayChange(day, checked === true)}
            />
            <label htmlFor={day} className="ml-2">{day}</label>
          </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2">Assign Teacher</label>
        <Select value={teacher ?? ""}  onValueChange={handleTeacherChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a teacher" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Teachers</SelectLabel>
              {teachers.length > 0 && teachers.map((teacher) => (
                <SelectItem key={teacher.user_id} value={teacher.user_id.toString()}>
                  {`${teacher.userDetails.first_name} ${teacher.userDetails.middle_name} ${teacher.userDetails.last_name}`}
                </SelectItem>
              ))}           
            </SelectGroup>
          </SelectContent>
        </Select>        
      </div>   
      <Button type="submit">Create Class</Button> 
    </form>     
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Creation</DialogTitle>
            <DialogDescription>
              Are you sure you want to create this class? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleConfirmCreateClass}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>      
      <Toaster />
    </div>       
  )
}
