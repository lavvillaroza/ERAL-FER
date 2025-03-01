import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

export const LessonPlanTimeline = ({ timelineItems }: { timelineItems: { time: string; title: string; desc: string }[] }) => {
  return (
    <ScrollArea className="h-[350px] pr-4">
      <div className="space-y-6">
        {timelineItems.map((item: { time: string; title: string; desc: string }, index: number) => (
          <div key={index} className="relative pl-8 pb-6">
            {/* Timeline vertical line */}
            {index !== timelineItems.length - 1 && (
              <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200"></div>
            )}
            
            {/* Time indicator and status marker */}
            <div className="flex items-center mb-2">
              <div className="absolute left-3 w-2 h-2 rounded-full bg-black ring-4 ring-gray-200"></div>
              
              <div className="text-sm font-medium px-2 py-1 rounded-md inline-block bg-gray-100 text-black">
                {item.time}
              </div>
            </div>
            
            {/* Content block */}
            <div className="ml-2">
              <h4 className="text-base font-medium mb-1 text-black">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};