import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Emotions {
    happy: number
    surprised: number
    neutral: number
  }
  
  interface StudentItem {
    id: number
    name: string
    course: string
    subject: string
    emotions: Emotions
  }
  
  interface TopStudentsCardProps {
    title: string
    students: StudentItem[]  
  }

export function TopStudentsCard({title, students}: TopStudentsCardProps) {    
    return (
        <Card className="shadow-lg">
          <CardContent className="p-3 sm:p-6 h-full flex flex-col">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-start">{title}</h2>
            <ScrollArea className="flex-1 h-[400px] sm:h-[500px] pr-2 sm:pr-4">
                {students.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500 text-sm sm:text-base italic">
                        No available data
                    </div>
                ) : ( 
                    <div className={`space-y-2 sm:space-y-4 pr-2 sm:pr-4`}>
                        {students.map((item, index) => (
                        <Card key={index} className="shadow-sm">
                            <CardContent className="p-2 sm:p-2">
                                <div className="flex items-center space-x-2 sm:space-x-4 p-2 sm:p-3 rounded-lg">
                                    <Avatar>
                                        <AvatarImage src={`/api/placeholder/32/32`} />
                                        <AvatarFallback>{item.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm sm:text-base truncate">{item.name}</p>                            
                                        <p className="text-xs sm:text-sm text-gray-500 truncate">{item.course}</p>
                                        <p className="text-xs sm:text-sm text-gray-500 truncate">{item.subject}</p>
                                    </div>
                                    <div className="flex justify-end gap-x-2 sm:gap-x-4 text-xs sm:text-sm text-right flex-wrap">
                                        <span className="flex items-center">😊 {item.emotions.happy}%</span>
                                        <span className="flex items-center">😲 {item.emotions.surprised}%</span>
                                        <span className="flex items-center">😐 {item.emotions.neutral}%</span>
                                    </div>
                                </div>                        
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                )}              
            </ScrollArea>
          </CardContent>
        </Card>
      );
} 