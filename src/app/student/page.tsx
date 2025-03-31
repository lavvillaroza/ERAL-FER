//Dashboard Defautl Page for Student
"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarStudent } from "@/components/app-sidebar-student";
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { TopClassesCard } from "@/components/top-classes-card";
import { useRouter } from "next/navigation";
import { getDecodedAuthToken, refreshAuthToken } from "@/services/authAppService";
import { toast, Toaster } from "sonner"
import { ExpressionChartsComplete } from "@/components/expression-charts-complete";
import Loading from "@/components/loading";
import { getOverAllFERChartDataByStudentUserId, getTopClassesCompletedDataByStudentUserId, getTopClassesCurrentDataByStudentUserId } from "@/services/classStudentFerAppService";

export default function Page() {
    // Set initial moods state
    const [moods, setMoods] = useState([
      { icon: "😲", percentage: "0.00", label: "Surprised", bgClass: "bg-gray-100/50", color: "text-orange-500" },
        { icon: "😊", percentage: "0.00", label: "Happy", bgClass: "bg-gray-100/50", color: "text-green-500" },
        { icon: "😐", percentage: "0.00", label: "Neutral", bgClass: "bg-gray-100/50", color: "text-blue-500" },
        { icon: "😢", percentage: "0.00", label: "Sad", bgClass: "bg-gray-100/50", color: "text-purple-500" },
        { icon: "🤢", percentage: "0.00", label: "Disgusted", bgClass: "bg-gray-100/50", color: "text-zinc-700" },
        { icon: "😡", percentage: "0.00", label: "Angry", bgClass: "bg-gray-100/50", color: "text-red-500" },
        { icon: "😨", percentage: "0.00", label: "Fearful", bgClass: "bg-gray-100/50", color: "text-slate-500" },
        { icon: "😶", percentage: "0.00", label: "NA", bgClass: "bg-gray-100/50", color: "hsl(0, 0%, 50%)" },
  ]);
  
  const router = useRouter();
  const [studentUserId, setStudentUserId] = useState<number>(0);  
  const [isLoading, setIsLoading] = useState(true);  
  const [topSubjectsCurrent, setTopSubjectsCurrent] = useState([]);
  const [topSubjectsCompleted, setTopSubjectsCompleted] = useState([]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await getDecodedAuthToken();
        if (!token) {
          console.log("No auth token found.");
          toast.error("Failed to fetch class subjects!", {
            description: "No auth token found.",
          });
          router.push("/login");
          return; // Stop execution
        }
        const decodedToken = token.data; 
        if (!decodedToken) {
          const refreshToken = await refreshAuthToken();
          if (!refreshToken || refreshToken.success === false) {
            router.push("/login");
          }
          setStudentUserId(refreshToken.data.id);
        }
        setStudentUserId(decodedToken.id);
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/login");
      }
    };
    checkSession();    
  }, [router]);
  
  useEffect(() => {        
          if (studentUserId === 0) return;        
          const fetchData = async () => {
            try {                                    
              const [responseExpression, responseTopClassesCurrPositveFER, responseTopClassesCompPositiveFER] = await Promise.all([
                getOverAllFERChartDataByStudentUserId(studentUserId),
                getTopClassesCurrentDataByStudentUserId(studentUserId),          
                getTopClassesCompletedDataByStudentUserId(studentUserId),              
              ]); 
                          
              if (!responseExpression.success) throw new Error(responseExpression.message);
              if (!responseTopClassesCurrPositveFER.success) throw new Error(responseTopClassesCurrPositveFER.message);
              if (!responseTopClassesCompPositiveFER.success) throw new Error(responseTopClassesCompPositiveFER.message);
              
              if (responseExpression.data) {          
                setMoods((prevMoods) => {
                  const newMoods =  responseExpression.data[0] || {};            
                  const updatedMoods = prevMoods.map((mood) => {
                    const moodKey = mood.label.toLowerCase().trim(); // Trim extra spaces
                    const moodValue = newMoods[moodKey];
                    return {
                      ...mood,
                      percentage: moodValue ? Number(moodValue).toFixed(2) : "0.00",
                    };
                  });        
                  return updatedMoods;
                });          
              }
  
              if (responseTopClassesCurrPositveFER.data) {
                  const result = responseTopClassesCurrPositveFER.data; // Assuming API returns an array of users
                  console.log(result);
                  // Format the results into the required structure
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const formattedData = result.map((row: { id: number; name: string; students: number; happy: number; surprised: number; neutral: number; }) => ({
                      id: row.id,
                      name: row.name,
                      students: Number(row.students),
                      emotions: {
                      happy: row.happy,
                      surprised: row.surprised,
                      neutral: row.neutral
                      }
                  }));
                  setTopSubjectsCurrent(formattedData);                
              }    

              if (responseTopClassesCompPositiveFER.data) {
                const result = responseTopClassesCompPositiveFER.data; // Assuming API returns an array of users
                console.log(result);
                // Format the results into the required structure
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formattedData = result.map((row: { id: number; name: string; students: number; happy: number; surprised: number; neutral: number; }) => ({
                    id: row.id,
                    name: row.name,
                    students: Number(row.students),
                    emotions: {
                    happy: row.happy,
                    surprised: row.surprised,
                    neutral: row.neutral
                    }
                }));
                setTopSubjectsCompleted(formattedData);                
            }    
            } catch (error) {
              console.log("Error fetching class subject:", error);
              toast.error("Failed to fetch class subject!", {
                description: error instanceof Error ? error.message : JSON.stringify(error),
              });
            }  
            finally {
              setIsLoading(false);
            }     
          }    
          fetchData();    
        }, [studentUserId]);


  return (   
    <> 
    <SidebarProvider>
      <AppSidebarStudent userId={studentUserId}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 sticky top-0 bg-white z-10 px-2 sm:px-4 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/student">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>                
              </BreadcrumbList>              
            </Breadcrumb>            
          </div>          
            {/* Right Side: Icons and Profile Picture */}
          <div className="flex items-center space-x-4">
             {/* Notification Bell with Counter */}
              <div className="relative">
                {/* Bell Icon */}
                {/* <button className="p-2 rounded-full hover:bg-gray-100 relative">
                    <Bell className="w-6 h-6 text-gray-600" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
                </button> */}
              </div>
          </div>
        </header>
        <div className="flex-1 p-2 sm:p-4 pt-0">            
            {isLoading ? (
              <Loading/>
              ) :  ( 
                  <>
                      <div className="h-full flex flex-col gap-2 sm:gap-4">
                          <ExpressionChartsComplete moods={moods} />
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-5 flex-1">
                              <TopClassesCard 
                                  title="Top Completed Classes with Positive Expressions"
                                  classes={topSubjectsCompleted}                                    
                              />
                              <TopClassesCard 
                                  title="Top Current Classes with Positive Expressions"
                                  classes={topSubjectsCurrent}                                        
                              />
                          </div>
                      </div>          
                  </>
              )}           
        </div>
      </SidebarInset>
    </SidebarProvider>    
    <Toaster />
    </>
  );
}