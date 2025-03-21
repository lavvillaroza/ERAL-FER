import { ClassSubjectModel } from "@/models/classSubjectModel";

export const getClassSubjects = async (status: string) => {
    try {
        const queryParams = `?status=${status}`; 
        const response = await fetch(`/api/class-subject${queryParams}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            } 
        });
        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("ClassSubjectAppService @ getUsersByUserId API:" + error);
    }         
};

export const getClassSubjectById = async (subject_id: number) => {
    try {        
        const response = await fetch(`/api/class-subject/${subject_id}`, {
            method: 'GET',
            credentials: 'include', // ✅ Ensure cookies are sent if needed                  
            headers: {
                'Content-Type': 'application/json'
            }  
        });
        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("ClassSubjectAppService @ getClassSubjectsById API:" + error);
    }    
};


export const getClassSubjectsByTeacherId = async (teacher_user_id: number, status: string) => {
    try {
        const queryParams = `?status=${status}`;        
        const response = await fetch(`/api/class-subject/teacher/${teacher_user_id}${queryParams}`, {
            method: 'GET',
            credentials: 'include', // ✅ Ensure cookies are sent if needed
            headers: {
                'Content-Type': 'application/json'
            }        
        });
        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("ClassSubjectAppService @ ClassSubjects by TeacherUserId API:" + error);
    }    
};

export const getClassSubjectsByStudentId = async (student_user_id: number, status: string) => {
    try {
        const queryParams = `?status=${status}`;        
        const response = await fetch(`/api/class-subject/student/${student_user_id}${queryParams}`, {
            method: 'GET',
            credentials: 'include', // ✅ Ensure cookies are sent if needed
            headers: {
                'Content-Type': 'application/json'
            }        
        });
        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("ClassSubjectAppService @ ClassSubjects by TeacherUserId API:" + error);
    }    
};

export const createClassSubject = async (
  classSubject: Omit<ClassSubjectModel, "id">) => {       
    try {
        const response = await fetch('/api/class-subject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(classSubject),
            credentials: 'include',
        });

        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("ClassSubjectAppService @ createClassSubject API:" + error);
    }      
};

export const updateClassSubjectStatus = async (subject_id: number,  status: string) => {    
    try {
        const response = await fetch(`/api/class-subject/${subject_id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: status }),         
            credentials: 'include',
        });    
    
        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("ClassSubjectAppService @ updateClassSubjectStatus API:" + error);
    }        
}
