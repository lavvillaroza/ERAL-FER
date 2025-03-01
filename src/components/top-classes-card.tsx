import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Emotions {
  happy: number
  surprised: number
  neutral: number
}

interface ClassItem {
  id: number
  name: string
  students: number
  emotions: Emotions
}

interface TopClassesCardProps {
  title: string
  classes: ClassItem[]
  schedule?: string
  showEnrollment?: boolean
}

export function TopClassesCard({ 
  title, 
  classes, 
  schedule, 
  showEnrollment = false
}: TopClassesCardProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-3 sm:p-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-start">
          {title}
        </h2>
        <ScrollArea className="h-[400px] sm:h-[500px] pr-2 sm:pr-4">
          <div className="space-y-3 sm:space-y-4">
            {classes.map((classItem) => (
              <Card key={classItem.id} className="bg-gray-50">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <div>
                      <p className="font-medium text-sm sm:text-base">{classItem.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {showEnrollment 
                          ? `${classItem.students} students enrolled`
                          : schedule
                        }
                      </p>
                    </div>
                    <div className="flex gap-x-2 sm:gap-x-4 text-xs sm:text-sm">
                      <span className="flex items-center">😊 {classItem.emotions.happy}%</span>
                      <span className="flex items-center">😲 {classItem.emotions.surprised}%</span>
                      <span className="flex items-center">😐 {classItem.emotions.neutral}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 