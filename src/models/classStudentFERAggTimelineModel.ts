export interface ClassStduentFERAggTimelineModel {        
    class_subject_id: number;
    class_schedule_id: number;
    time_per_minute: string; // Ensure it's a string before converting to Date
    surprised: number;
    happy: number;
    neutral: number;
    sad: number;
    angry: number;
    disgusted: number;
    fearful: number;
    na: number;    
  }