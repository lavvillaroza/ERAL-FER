import { ClassScheduleModel } from "@/models/classScheduleModel";

export const getClassSchedules = async (class_subject_id: number): Promise<ClassScheduleModel[]> => {
    const response = await fetch(`/api/class-schedule/class-subject/${class_subject_id}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

export const getClassScheduleById = async (class_schedule_id: number): Promise<ClassScheduleModel> => {
    const response = await fetch(`/api/class-schedule/${class_schedule_id}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

export const createClassSchedule = async (
  classSubject: Omit<ClassScheduleModel, "id">
) => {    
    const response = await fetch(`/api/class-schedule/${classSubject.class_subject_id}`, {
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

export const updateClassSchedule = async (id: number, status: string) => {    
    const response = await fetch("/api/class-schedule", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, status: status }),         
    });    

    const data = await response.json();    

    if (!response.ok) {
        console.log("API Response Error:", data); // Log error response
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }    

    return  { data, status: response.status, success: response.ok };
}