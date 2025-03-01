/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Printer } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, FileText, Activity } from 'lucide-react'
import { ExpressionCharts } from "@/components/expression-charts"
import { FERLineChart } from "@/components/FERLineChart"
import { StudentEngagementTable } from "@/components/tables/student-engagement-table"
import { LessonPlanTimeline } from "@/components/LessonPlanTimeline"
export const ClassScheduleTable = ({ 
  classSchedule, 
  getStatusBadgeVariant, 
  setSelectedSession, 
  handlePrint,
  ferTimeSeriesData,
}: {
  classSchedule: any[];
  getStatusBadgeVariant: (status: string) => string;
  setSelectedSession: (session: any) => void; 
  handlePrint: () => void;
  ferTimeSeriesData: any[];
  moods: any[];
  students: any[];
  timelineItems: any[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time Range</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Remarks</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classSchedule.map((session: any) => (
          <TableRow key={session.id}>
            <TableCell>{session.date}</TableCell>
            <TableCell>{session.timeRange}</TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(session.status) as "default" | "destructive" | "outline" | "secondary" | "success" | "warning"}>
                {session.status}
              </Badge>
            </TableCell>
            <TableCell>{session.remarks}</TableCell>
            <TableCell className="text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedSession(session)}
                  >
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[900px] h-[90vh] p-0 gap-0">
                  <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-xl">
                        Class Session: {session?.date}
                      </DialogTitle>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {session?.timeRange}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(session?.status) as "default" | "destructive" | "outline" | "secondary" | "success" | "warning"}>
                        {session?.status}
                      </Badge>
                    </div>
                    <DialogDescription className="mt-2">
                      {session?.remarks}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="px-6 overflow-y-auto">
                    <Tabs defaultValue="analytics" className="w-full">
                      <TabsList className="w-full grid grid-cols-3">
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="students">Students</TabsTrigger>
                        <TabsTrigger value="lesson">Lesson Plan</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="analytics" className="space-y-6 mt-4">
                        {/* Real-time FER Line Chart */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Real-time FER Analysis</CardTitle>
                            <CardDescription>
                              Tracking emotional expressions throughout the class session
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[300px]">
                              <FERLineChart ferTimeSeriesData={ferTimeSeriesData} />
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Improved Session Emotional Analysis */}
                        <Card className="mb-6">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Activity className="h-5 w-5" />
                              Overall Facial Emotion Recognition (FER)
                            </CardTitle>
                            <CardDescription>
                              Average emotional expressions across all students in this class
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-auto sm:h-[165px]">
                              <ExpressionCharts moods={session?.moods} />
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="students" className="mt-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Users className="h-4 w-4" />
                              Student Engagement
                            </CardTitle>
                            <CardDescription>
                              Real-time FER of students present in this session
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <StudentEngagementTable students={session?.students} />
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      {/* Improved Lesson Plan Tab */}
                      <TabsContent value="lesson" className="mt-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Lesson Progress
                            </CardTitle>
                            <CardDescription>
                              Topic progression with timing during this session
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <LessonPlanTimeline timelineItems={session?.timelineItems} />
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <DialogFooter className="px-6 py-4 border-t">
                    <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
                      <Printer className="h-4 w-4" />
                      Print Details
                    </Button>
                    <DialogClose asChild>
                      <Button>Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}