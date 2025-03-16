export interface ClassAttendanceModel {
    id: number;
    class_subject_id: number;
    class_schedule_id: number;
    student_user_id: number;   
    time_in: string;
    time_out?: string;    
    status: string; 
  }