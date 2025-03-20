/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Search, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClassSubjectModel } from "@/models/classSubjectModel";
import { getUsersByRole, getUserByUserId } from "@/services/userAppService";
import { GetFullName } from "@/lib/fullName";
import { UserModel } from "@/models/userModel";
import { addClassStudents, getClassStudents } from "@/services/classStudentAppService";
import { ClassStudentModel } from "@/models/classStudentModel";
import { toast, Toaster } from "sonner"
import Image from "next/image";

interface SubjectCardProps {
  subject: ClassSubjectModel;
  user_id: number;
  variant: "student" | "teacher";
}

export const SubjectCard = ({ subject, user_id, variant }: SubjectCardProps) => {
  const router = useRouter();
  const [teacher, setTeacher] = useState<UserModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {                
      const fetchTeacher = async () => {
        try {
          const response = await getUserByUserId(subject.teacher_user_id);
          setTeacher(response.data);
        } catch(error) {
          console.log(error);
          setError("Failed to fetch teachers!");        
        }
      };      
      fetchTeacher();
    }, [subject.teacher_user_id]);

    const handleJoin = useCallback(() => {
      const basePath = variant === "student" ? "/student" : "/teacher";
      router.push(`${basePath}/my-classes/current/${variant === "student" ? subject.id : subject.teacher_user_id}`);
    }, [router, variant, subject.id, subject.teacher_user_id]);
    
    const checkIfCurrentTime = useCallback((timeRange: string) => {
      const [start, end] = timeRange.split(" - ");
      const now = new Date();
  
      const startTime = new Date();
      const endTime = new Date();
  
      const startParts = start.match(/(\d+):?(\d+)?([AP]M)/);
      const endParts = end.match(/(\d+):?(\d+)?([AP]M)/);
  
      if (!startParts || !endParts) return false;
  
      let startHour = parseInt(startParts[1]);
      if (startParts[3] === "PM" && startHour !== 12) startHour += 12;
      if (startParts[3] === "AM" && startHour === 12) startHour = 0;
  
      let endHour = parseInt(endParts[1]);
      if (endParts[3] === "PM" && endHour !== 12) endHour += 12;
      if (endParts[3] === "AM" && endHour === 12) endHour = 0;
  
      startTime.setHours(startHour, parseInt(startParts[2] || "0"), 0);
      endTime.setHours(endHour, parseInt(endParts[2] || "0"), 0);
  
      return now >= startTime && now <= endTime;
    }, []);

  const isCurrentTime = checkIfCurrentTime(subject.time_schedule);
  const isJoinable = isCurrentTime;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <Image 
            src="/images/subject-image.png"
            alt={subject.name}
            priority={false}
            width={400}
            height={192}
            loading="lazy"
            className="w-full h-48 rounded-2xl object-cover"/>          
        </div>
                
        <div className="p-4">
          <h3 className="font-semibold mb-2">
            {subject.name} 
          </h3>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock size={16} className="mr-2" />
            {subject.time_schedule + " [ " + subject.days + " ]"}
          </div>
          <div className="flex items-center mt-3">
            <Image 
              src="/images/user.png"
              alt="title"
              width={32}
              height={32}
              loading="lazy"              
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-600">{GetFullName(teacher?.userDetails)}</span>
          </div>

          <div className="grid grid-cols-1 gap-2 mt-4 sm:grid-cols-2">
            {variant === "teacher" ? (
                <>
                  <Button
                    variant="outline" 
                    className="flex-1"
                    onClick={() => router.push(`/${variant}/my-classes/current/class-details/${subject.id}`)}>
                    Details
                  </Button> 
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/${variant}/my-classes/current/view-students/${subject.id}`)}>
                    View Students
                  </Button>
                </>                
            ) : (
              <Button
                  variant="outline" 
                  className="flex-1 col-span-2"
                  onClick={() => router.push(`/${variant}/my-classes/current/class-details/${subject.id}`)}>
                  Details
              </Button> 
            )}                                    
          </div>
        </div>
      </CardContent>
    </Card>
  );
};