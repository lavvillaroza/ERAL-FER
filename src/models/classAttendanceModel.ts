export interface classAttendanceModel {
    id: number;
    class_id: number;
    student_id: number;   
    time_in: Date;
    time_out: Date;    
    status: string; 
  }