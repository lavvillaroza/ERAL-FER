'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ClassSubjectModel } from '@/models/classSubjectModel'
import { toast } from "sonner";
import { getDecodedAuthToken, refreshAuthToken } from '@/services/authAppService'
import { useRouter } from 'next/navigation'
import { getClassSubjects } from '@/services/classSubjectAppService'
import { ClassStatus } from '@/types/classStatus'
import { getUsers } from '@/services/userAppService'
import { UserDetailsModel } from '@/models/userDetailsModel'
import { GetFullName } from '@/lib/fullName'
import { UserRole } from '@/types/userRole'
import { Badge } from '@/components/ui/badge'
import Loading from '@/components/loading'

// Define a new interface for the merged result
export interface ClassSubjectWithTeacher extends ClassSubjectModel {
  teacherDetails?: UserDetailsModel | null; // Optional in case no match is found
}

export default function CurrentClasses() {
  const router = useRouter();
  const [classSubjects, setClassSubjects] = useState<ClassSubjectModel[]>([]);
  const [classTeachersDetails, setClassTeachersDetails] = useState<UserDetailsModel[]>([]);  
  const [adminUserId, setAdminUserId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);    
  const [classSubjectWTeacherDetails, setClassSubjectWTeacherDetails] = useState<ClassSubjectWithTeacher[]>([]);
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
          setAdminUserId(refreshToken.data.id);
        } else {
          setAdminUserId(decodedToken.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/login");
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        if (adminUserId === 0) return;

        setIsLoading(true);        
        const [responseGetSubjects, responseGetTeachers] = await Promise.all([
                  getClassSubjects(ClassStatus.CURRENT),          
                  getUsers(UserRole.TEACHER),
                ]);
        if (!responseGetSubjects.success) throw new Error(responseGetSubjects.message);            
        if (!responseGetTeachers.success) throw new Error(responseGetTeachers.message);        

        setClassSubjects(responseGetSubjects.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getUserDetails = responseGetTeachers.data.map(((user: { userDetails: any }) => user.userDetails));        
        setClassTeachersDetails(getUserDetails);

      } catch (error) {
        console.log("Error fetching class subjects:", error);
        toast.error("Failed to fetch class subjects!", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        });
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchData();  
  }, [adminUserId]);

  // Function to merge data
  const matchSubjectsWithTeachers = (
    subjects: ClassSubjectModel[],
    users: UserDetailsModel[]
  ): ClassSubjectWithTeacher[] => {
    return subjects.map(subject => ({
        ...subject,
        teacherDetails: users.find(user => user.user_id === subject.teacher_user_id) || null
    }));
  };

  useEffect(() => {
    const combinedData = matchSubjectsWithTeachers(classSubjects, classTeachersDetails);
    setClassSubjectWTeacherDetails(combinedData);
  },[classSubjects, classTeachersDetails]);

  return (
    <>
      {isLoading ? 
        (
          <div className="flex items-center justify-center h-[700px] w-full">
            <Loading />
          </div>                
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-6 auto-rows-fr">
            {classSubjectWTeacherDetails.map((subject) => (
              <Card 
                key={subject.id} 
                className="w-auto min-w-[200px] h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-full flex justify-start">                
                    <Badge>{subject.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-4 flex-grow">
                  <h3 className="font-semibold mb-2">{subject.name}</h3>              
                  <p className="text-sm text-gray-500">Instructor: {GetFullName(subject.teacherDetails ?? undefined)}</p>
                  <p className="text-sm text-gray-500">Schedule: {`[ ${subject.days} ]`}</p>
                  <p className="text-sm text-gray-500">Time: {`${subject.time_schedule}`}</p>
                </CardContent>
                <CardFooter className="mt-auto"> {/* Pushes footer to the bottom */}                    
                  <div className="grid grid-cols-1 gap-2 mt-4 sm:grid-cols-2 ml-auto justify-self-end">
                        <Button
                            variant="outline" 
                            className="flex-1"
                            onClick={() => router.push(`/admin/class-management/class-details/${subject.id}`)}>
                            Details
                        </Button> 
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.push(`/admin/class-management/view-students/${subject.id}`)}>
                            View Students
                        </Button>                                  
                  </div>
                </CardFooter>
              </Card>
            ))}             
          </div>                                 
        )}          
    </>     
  )
} 