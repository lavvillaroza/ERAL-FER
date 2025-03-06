import { ClassStudentModel } from "@/models/classStudentModel";
import { ClassSubjectModel } from "@/models/classSubjectModel";

export const getClassStudents = async (class_subject_id: number): Promise<ClassStudentModel[]> => {
    const response = await fetch(`/api/class-student/${class_subject_id}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

export const getClassSubjectsByStudentId = async (student_id: number): Promise<ClassSubjectModel[]> => {
    const response = await fetch(`/api/class-student/${student_id}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};


export const addClassStudents = async (
    classSubject: ClassStudentModel[]
  ) => {    
      const response = await fetch('/api/class-student', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(classSubject),
          credentials: 'include',
      });
  
      const data = await response.json();
  
      if (!response.ok) {
          console.log("API Response Error:", data); // Log error response
          throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      return data;
  };