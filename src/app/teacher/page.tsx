"use client";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarTeacher } from "@/components/app-sidebar-teacher"
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { TopTenCard } from "@/components/top-ten-card";
import { TopStudents } from "@/components/top-students";
import { ExpressionChartsComplete } from "@/components/expression-charts-complete";
import { useRouter } from "next/navigation";
import { getDecodedAuthToken, refreshAuthToken } from "@/services/authAppService";
import { toast } from "sonner";

export default function Page() {
    const [moods] = useState([
        { icon: "😲", percentage: "0.00", label: "Surprised", bgClass: "bg-gray-100/50", color: "text-orange-500" },
        { icon: "😊", percentage: "0.00", label: "Happy", bgClass: "bg-gray-100/50", color: "text-green-500" },
        { icon: "😐", percentage: "0.00", label: "Neutral", bgClass: "bg-gray-100/50", color: "text-blue-500" },
        { icon: "😢", percentage: "0.00", label: "Sad", bgClass: "bg-gray-100/50", color: "text-purple-500" },
        { icon: "🤢", percentage: "0.00", label: "Disgusted", bgClass: "bg-gray-100/50", color: "text-zinc-700" },
        { icon: "😡", percentage: "0.00", label: "Angry", bgClass: "bg-gray-100/50", color: "text-red-500" },
        { icon: "😨", percentage: "0.00", label: "Fearful", bgClass: "bg-gray-100/50", color: "text-slate-500" },
        { icon: "😶", percentage: "0.00", label: "NA", bgClass: "bg-gray-100/50", color: "hsl(0, 0%, 50%)" },
    ]);

    const positiveClasses = [
        { name: "Mathematics 101", happiness: "85", students: 30 },
        { name: "Physics Advanced", happiness: "82", students: 25 },
        { name: "Chemistry Lab", happiness: "80", students: 28 },
        { name: "Biology 201", happiness: "78", students: 22 },
        { name: "Computer Science", happiness: "77", students: 35 },
        { name: "English Literature", happiness: "75", students: 27 },
        { name: "History 101", happiness: "73", students: 31 },
        { name: "Art Class", happiness: "72", students: 20 },
        { name: "Music Theory", happiness: "70", students: 24 },
        { name: "Physical Education", happiness: "69", students: 33 },
    ];

    const router = useRouter(); 
    const [userId, setUserId] = useState<number>(0);  
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
            setUserId(refreshToken.data.id);
            } else {
            setUserId(decodedToken.id);
            }
        } catch (error) {
            console.error("Error checking session:", error);
            router.push("/login");
        }
        };
        checkSession();
    }, [router]);

    return (    
        <SidebarProvider>
            <AppSidebarTeacher userId={userId}/>
            <SidebarInset className="h-screen flex flex-col overflow-y-auto overflow-x-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 sticky top-0 bg-white z-10 px-2 sm:px-4 border-b">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/teacher">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>                
                            </BreadcrumbList>              
                        </Breadcrumb>            
                    </div>          
                    <div className="flex items-center space-x-4 px-4">
                        <div className="relative">
                            {/* <button className="p-2 rounded-full hover:bg-gray-100 relative">
                                <Bell className="w-6 h-6 text-gray-600" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
                            </button> */}
                        </div>
                    </div>
                </header>
                <div className="flex-1 p-2 sm:p-4 pt-0">            
                    <div className="h-full flex flex-col gap-2 sm:gap-4">
                        <ExpressionChartsComplete moods={moods} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-5 flex-1">
                            <TopStudents />
                            <TopTenCard
                                title="Top 10 Classes with Positive Expression"
                                type="classes"
                                data={positiveClasses}
                            />
                        </div>
                    </div>          
                </div>
            </SidebarInset>
        </SidebarProvider>    
    );
}