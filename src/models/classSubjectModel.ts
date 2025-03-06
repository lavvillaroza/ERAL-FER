
export interface ClassSubjectModel {
    id: number;
    name: string;
    description: string;
    start_date: Date | null;
    end_date:   Date | null;   
    time_schedule: string;
    days: string; 
    teacher_user_id: number;
    status: string;
  }