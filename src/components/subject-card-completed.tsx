/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
  subject: Subject;
  onDetailsClick: () => void;
  variant: "teacher" | "student";
}

export function SubjectCard({ subject, onDetailsClick, variant }: SubjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <Image 
            src={subject.image}
            alt={subject.title}
            width={400}
            height={192}
            className="w-full h-48 rounded-2xl object-cover"
          /> 
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
            <Image 
              src={subject.instructorimage}
              alt={subject.instructor}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-600">{subject.instructor}</span>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline" 
              className="flex-1"
              onClick={onDetailsClick}
            >
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
