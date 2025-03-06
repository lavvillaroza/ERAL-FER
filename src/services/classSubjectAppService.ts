import { ClassSubjectModel } from "@/models/classSubjectModel";

export const getClassSubjects = async (): Promise<ClassSubjectModel[]> => {
    const response = await fetch('/api/class-subject', {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

export const getClassSubjectById = async (subject_id: number) => {
    const response = await fetch(`/api/class-subject/${subject_id}`, {
        method: 'GET',
        credentials: 'include', // ✅ Ensure cookies are sent if needed
        headers: {
            'Content-Type': 'application/json'
        }        
    });

    const data = await response.json();    

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return data;
};


export const getClassSubjectsByTeacherId = async (teacher_user_id: number) => {

    const response = await fetch(`/api/class-subject/teacher/${teacher_user_id}`, {
        method: 'GET',
        credentials: 'include', // ✅ Ensure cookies are sent if needed
        headers: {
            'Content-Type': 'application/json'
        }        
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return data;
};

export const createClassSubject = async (
  classSubject: Omit<ClassSubjectModel, "id">
) => {    
    const response = await fetch('/api/class-subject', {
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

