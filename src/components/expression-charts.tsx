"use client";

import { Card, CardContent } from "@/components/ui/card";
import DonutChart from "@/components/donutchart";
import { useEffect, useState } from "react";
import { ClassStudentFERModel } from "@/models/classStudentFERModel";

interface ExpressionChartsProps {
  studentFer: ClassStudentFERModel;
  chartSize?: number;
  strokeWidth?: number;
  className?: string;
}

export function ExpressionCharts({
  studentFer,
  chartSize = 80,
  strokeWidth = 8,
  className = ""
}: ExpressionChartsProps) {
  const [responsiveSize, setResponsiveSize] = useState(chartSize);
  const [moods, setMoods] = useState([
    { icon: "😲", percentage: "0.00", label: "Surprised", bgClass: "bg-gray-100/50",color: "text-orange-500"},
    { icon: "😊", percentage: "0.00", label: "Happy", bgClass: "bg-gray-100/50", color: "text-green-500"},
    { icon: "😐", percentage: "0.00", label: "Neutral", bgClass: "bg-gray-100/50", color: "text-blue-500"},
    { icon: "😢", percentage: "0.00", label: "Sad", bgClass: "bg-gray-100/50", color: "text-purple-500"},
    { icon: "🤢", percentage: "0.00", label: "Disgusted", bgClass: "bg-gray-100/50", color: "text-zinc-700"},
    { icon: "😡", percentage: "0.00", label: "Angry", bgClass: "bg-gray-100/50", color: "text-red-500" },
    { icon: "😨", percentage: "0.00", label: "Fearful", bgClass: "bg-gray-100/50", color: "text-slate-500"},
  ]);

  useEffect(() => {
    if (studentFer) {
      const updatedMoods = moods.map(mood => {
        const ferValue = Number(studentFer[mood.label.toLowerCase() as keyof ClassStudentFERModel]);
        return {
          ...mood,
          percentage: !isNaN(ferValue) ? ferValue.toFixed(2) : "0.00"
        };
      });
      setMoods(updatedMoods);
    }
  }, [studentFer]);

  useEffect(() => {
    const handleResize = () => {
      const calculatedSize = Math.max(60, Math.min(window.innerWidth / 10, chartSize));
      setResponsiveSize(calculatedSize);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartSize]);
  
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4 ${className}`}>
      {moods.map((mood, index) => (
        <Card key={index} className="shadow-lg ">
          <CardContent className={`flex flex-col items-center justify-center p-2 sm:p-4 rounded-[7px] ${mood.bgClass}`}>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-800 mb-1 sm:mb-2 max-w-full truncate w-full text-center">{mood.icon} {mood.label}</p>
            <div className="flex justify-center items-center py-1 sm:py-2 ">
              <DonutChart
                value={parseFloat(mood.percentage)}
                color={mood.color}
                size={responsiveSize}
                
                strokeWidth={Math.max(4, Math.min(strokeWidth, responsiveSize / 8))}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}