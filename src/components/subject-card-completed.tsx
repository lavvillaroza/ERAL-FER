/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ClassSubjectModel } from "@/models/classSubjectModel";
import { GetFullName } from "@/lib/fullName";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserModel } from "@/models/userModel";
import { getUserByUserId } from "@/services/userAppService";

export interface Subject {
  id: number;
  title: string;
  code: string;
  time: string;
  instructor: string;
  instructorimage: string;
  image: string;
  status: string;
  teacherId?: string;
  roomId?: string;
}

interface SubjectCardProps {
  subject: ClassSubjectModel;
  user_id: number;  
  variant: "teacher" | "student";
}

export function SubjectCard({ subject, user_id, variant }: SubjectCardProps) {
  const router = useRouter();
  const [teacher, setTeacher] = useState<UserModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {           
        const fetchTeacher = async () => {
          try {
            const response = await getUserByUserId(user_id);          
            setTeacher(response);
  
          } catch(error) {
            console.log(error);
            setError("Failed to fetch teachers!");        
          }
        };      
        fetchTeacher();
      }, [user_id]);
      
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <Image 
            src="/images/subject-image.png"
            alt={subject.name}
            width={400}
            height={192}
            priority={false}
            loading="lazy"
            className="w-full h-48 rounded-2xl object-cover"
          /> 
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
          
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline" 
              className="flex-1"
              onClick={() => router.push(`/${variant}/my-classes/current/view-students/${subject.id}`)}>
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
