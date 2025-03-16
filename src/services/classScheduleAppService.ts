import { ClassCourseContentModel } from "@/models/classCourseContentModel";
import { ClassScheduleModel } from "@/models/classScheduleModel";
import { ClassScheduleStatus } from "@/types/classScheduleStatus";

export const getClassSchedules = async (class_subject_id: number) => {
    try {        
        const response = await fetch(`/api/class-subject/${class_subject_id}/schedule`, {
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
        throw new Error("ClassScheduleAppService @ getClassSchedules API error:" + error);
    }           
};

export const getClassScheduleById = async (class_subject_id: number, class_schedule_id: number) => {
    try {
        const response = await fetch(`/api/class-subject/${class_subject_id}/schedule/${class_schedule_id}`, {
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
        throw new Error("ClassScheduleAppService @ getClassScheduleById API error:" + error);
    }           
};

export const createClassSchedule = async (
  classSubject: Omit<ClassScheduleModel, "id">
) => {   
    try {
        const response = await fetch(`/api/class-subject/${classSubject.class_subject_id}/schedule`, {
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
        throw new Error("ClassScheduleAppService @ createClassSchedule API error:" + error);
    }        
};

export const updateClassScheduleStatus = async (subject_id: number, schedule_id: number, status: string) => {    
    try {
        const response = await fetch(`/api/class-subject/${subject_id}/schedule/${schedule_id}`, {
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
        throw new Error("ClassScheduleAppService @ updateClassScheduleStatus API error:" + error);
    }        
}

export const updateClassSchedule = async (schedule_id: number, OPENED: ClassScheduleStatus, classSchedule: ClassScheduleModel) => {    
    try {
        const response = await fetch(`/api/class-subject/${classSchedule.class_subject_id}/schedule/${classSchedule.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(classSchedule),         
            credentials: 'include',
        });    
    
        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("ClassScheduleAppService @ updateClassSchedule API error:" + error);
    }             
}

export const getClassCourseContentByScheduleId  = async (class_schedule_id: number) => {    
    try {
        const response = await fetch(`/api/class-course-contents/${class_schedule_id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },            
        });
        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("ClassScheduleAppService @ getClassCourseContentByScheduleId API error:" + error);
    }    
}

export const updateClassCourseContentsByScheduleId = async (
    classCourseContents: Omit<ClassCourseContentModel[], "id">, class_schedule_id: number, topic_title: string) => {    
    try {
        const response = await fetch(`/api/class-course-contents/${class_schedule_id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({classCourseContents, topic_title,}),
        });
        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("ClassScheduleAppService @ updateClassCourseContentsByScheduleId API error:" + error);
    }         
}

export const updateClassCourseContentsStatusByScheduleIdAndId = async (status: string, id: number, class_schedule_id: number) => { 
    try {
        const response = await fetch(`/api/class-course-contents/${class_schedule_id}/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({status}),
        });

        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("ClassScheduleAppService @ updateClassCourseContentsByScheduleId API error:" + error);
    }        

}
