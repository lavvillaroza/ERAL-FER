import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopTenCardProps {
  title: string;
  type: 'students' | 'classes';
  data: Array<{
    id?: string;
    name: string;
    course?: string;
    students?: number;
    happiness?: string;
  }>;
}

export function TopTenCard({ title, type, data }: TopTenCardProps) {
  return (
    <Card className="col-span-1 shadow-lg overflow-hidden h-[60vh] sm:h-[65vh]">
      <CardContent className="p-3 sm:p-6 h-full flex flex-col">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">{title}</h2>
        <ScrollArea className="flex-1">
          <div className={`${type === 'students' ? 'space-y-2 sm:space-y-4' : 'grid grid-cols-1 gap-2 sm:gap-4'} pr-2 sm:pr-4`}>
            {data.map((item, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-2 sm:p-4">
                  {type === 'students' ? (
                    <div className="flex items-center space-x-2 sm:space-x-4 p-2 sm:p-3 rounded-lg">
                      <Avatar>
                        <AvatarImage src={`/api/placeholder/32/32`} />
                        <AvatarFallback>{item.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{item.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">ID: {item.id}</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{item.course}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0 mr-2">
                        <h3 className="font-medium text-sm sm:text-base truncate">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{item.students} students</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-green-600 font-medium text-base sm:text-lg whitespace-nowrap">
                          {item.happiness}%
                        </span>
                        <h1 className="text-xs sm:text-sm text-gray-500 mt-1">Happy</h1>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 