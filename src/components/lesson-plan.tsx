import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface TimelineItem {
  time: string;
  title: string;
  desc: string;
  completed: boolean;
  current: boolean;
}

interface LessonPlanProps {
  items: TimelineItem[];
  title?: string;
  className?: string;
}

export function LessonPlan({ items, title = "Lesson Progress", className = "" }: LessonPlanProps) {
  return (
    <Card className={`shadow-lg ${className}`}>
      <CardContent className="p-4 sm:p-4 lg:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">{title}</h2>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="relative pl-8 pb-6">
                {/* Timeline vertical line */}
                {index !== items.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200"></div>
                )}
                {/* Time indicator and status marker */}
                <div className="flex items-center mb-2">
                  <div
                    className={`absolute left-3 w-2 h-2 rounded-full ${
                      item.current
                        ? "bg-blue-600 ring-4 ring-blue-100"
                        : item.completed
                        ? "bg-green-500 ring-4 ring-green-100"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <div
                    className={`text-sm font-medium px-2 py-1 rounded-md inline-block ${
                      item.current
                        ? "bg-blue-100 text-blue-800"
                        : item.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.time}
                  </div>
                </div>
                {/* Content block */}
                <div className="ml-2">
                  <h4
                    className={`text-base font-medium mb-1 ${
                      item.current
                        ? "text-blue-700"
                        : item.completed
                        ? "text-green-700"
                        : "text-gray-700"
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 