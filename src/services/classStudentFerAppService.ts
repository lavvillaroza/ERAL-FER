import { ClassStudentFERModel } from "@/models/classStudentFERModel";

export const addClassStudentFERData = async (    
    id: number, 
    schedule_id: number, 
    user_id: number, 
    studentFerArr: Omit<ClassStudentFERModel, "id">) => { 
    try {
        const response = await fetch(`/api/class-subject/${id}/schedule/${schedule_id}/students/${user_id}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentFerArr),
        });

        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("ClassStudentFerAppService @ addClassStudentFERData API:" + error);
    }        
}

export const getFERChartDataBySubjectId = async (subject_id: number) => { 
    try {
        const response = await fetch(`/api/class-student-fer/${subject_id}/chart`, {
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
        throw new Error("ClassStudentFerAppService @ getFERChartDataBySubjectId API:" + error);
    }        
}

export const getFERChartDataBySubjectSchedIds = async (subject_id: number, schedule_id: number) => { 
    try {
        const response = await fetch(`/api/class-student-fer/${subject_id}/schedule/${schedule_id}/chart`, {
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
        throw new Error("ClassStudentFerAppService @ getFERChartDataBySubjectSchedIds API:" + error);
    }        
}

export const getFERTimelineDataBySubjectSchedIds = async (subject_id: number, schedule_id: number) => { 
    try {
        const response = await fetch(`/api/class-student-fer/${subject_id}/schedule/${schedule_id}/timeline`, {
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
        throw new Error("ClassStudentFerAppService @ getFERTimelineDataBySubjectSchedIds API:" + error);
    }        
}

export const getFERLast5MinutesDataBySubjectSchedIds = async (subject_id: number, schedule_id: number) => { 
    try {
        const response = await fetch(`/api/class-student-fer/${subject_id}/schedule/${schedule_id}/five-minutes`, {
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
        throw new Error("ClassStudentFerAppService @ getFERTimelineDataBySubjectSchedIds API:" + error);
    }        
}

export const getFERTimelineDataBySubjectSchedStudentUserIds = async (subject_id: number, schedule_id: number, student_user_id: number) => { 
    try {
        const response = await fetch(`/api/class-student-fer/${subject_id}/schedule/${schedule_id}/student/${student_user_id}/timeline`, {
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
        throw new Error("ClassStudentFerAppService @ getFERTimelineDataBySubjectSchedStudentUserIds API:" + error);
    }        
}

export const getFERChartDataBySubjectSchedStudentUserIds = async (subject_id: number, schedule_id: number, student_user_id: number) => { 
    try {
        const response = await fetch(`/api/class-student-fer/${subject_id}/schedule/${schedule_id}/student/${student_user_id}/chart`, {
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
        throw new Error("ClassStudentFerAppService @ getFERChartDataBySubjectSchedStudentUserIds API:" + error);
    }        
}

export const getFERChartDataBySubjectStudentUserIds = async (subject_id: number, user_id: number) => { 
    try {
        const response = await fetch(`/api/class-student-fer/${subject_id}/student/${user_id}/chart`, {
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
        throw new Error("ClassStudentFerAppService @ getFERChartDataBySubjectStudentUserIds API:" + error);
    }        
}

export const getFERStudentsDataBySubjectId = async (subject_id: number) => { 
    try {
        const response = await fetch(`/api/class-student-fer/${subject_id}/student`, {
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
        throw new Error("ClassStudentFerAppService @ getFERStudentsDataBySubjectId API:" + error);
    }        
}

export const getFERStudentsDataBySubjectStudentUserIds = async (subject_id: number, user_id: number) => { 
    try {
        const response = await fetch(`/api/class-student-fer/${subject_id}/student/${user_id}`, {
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
        throw new Error("ClassStudentFerAppService @ getFERStudentsDataBySubjectId API:" + error);
    }        
}


export const getFERStudentsDataBySubjectScheduleStudentUserIds = async (subject_id: number, schedule_id: number, user_id: number) => { 
    try {
        const response = await fetch(`/api/class-student-fer/${subject_id}/schedule/${schedule_id}/student/${user_id}`, {
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
        throw new Error("ClassStudentFerAppService @ getFERStudentsDataBySubjectScheduleId API:" + error);
    }        
}

export const getFERStudentsDataBySubjectScheduleIds = async (subject_id: number, schedule_id: number) => { 
    try {
        const response = await fetch(`/api/class-student-fer/${subject_id}/schedule/${schedule_id}/student`, {
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
        throw new Error("ClassStudentFerAppService @ getFERStudentsDataBySubjectScheduleId API:" + error);
    }        
}
