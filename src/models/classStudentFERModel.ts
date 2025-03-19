export interface ClassStudentFERModel {
    id: number;
    classsched_id: number;
    student_user_id: number;   
    surprised: number;
    happy: number;
    neutral: number;
    sad: number;
    angry: number;
    disgusted: number;
    fearful: number;
    highest_value: number;
    dominant_fer: string;
    datetime_stamp: Date;    
  }