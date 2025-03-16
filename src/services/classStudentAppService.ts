import { ClassStudentModel } from "@/models/classStudentModel";
import { ClassSubjectModel } from "@/models/classSubjectModel";

export const getClassStudents = async (class_subject_id: number) => {
    try {
        const response = await fetch(`/api/class-subject/${class_subject_id}/student`, {
            method: 'GET',
            credentials: 'include',
        });
        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("ClassStudentAppService @ getClassStudents API error:" + error);
    }    
};

export const getClassSubjectsByStudentId = async (id: number, student_user_id: number): Promise<ClassSubjectModel[]> => {
    try {
        const response = await fetch(`/api/class-subject/${id}/student/${student_user_id}`, {
            method: 'GET',
            credentials: 'include',
        });
        
        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;        
    }
    catch (error) {
        throw new Error("ClassStudentAppService @ classSubject by StudentUserId API error:" + error);
    }    
};


export const addClassStudents = async (id: number,
    classStudents: ClassStudentModel[]
  ) => {  
    try {
        const response = await fetch(`/api/class-subject/${id}/student`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(classStudents),
            credentials: 'include',
        });

        const result = await response.json();
        console.log(result);
        
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("ClassStudentAppService @ classStudents API error:" + error);
    }          
  };