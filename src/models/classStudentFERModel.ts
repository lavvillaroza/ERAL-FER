export interface classStudentFERModel {
    id: number;
    classsched_id: number;
    student_id: number;   
    surprised: number;
    happy: number;
    neutral: number;
    sad: number;
    angry: number;
    disgusted: number;
    fearful: number;
    result: string;
    remarks: string;
    datetime_stamp: Date;    
  }