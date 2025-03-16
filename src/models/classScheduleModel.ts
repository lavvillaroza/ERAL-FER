import { ClassCourseContentModel } from "./classCourseContentModel";

export interface ClassScheduleModel {
    id: number;
    class_subject_id: number;
    date_schedule: string
    time_start: string;   
    time_end: string;
    status: string;    
    topic_title: string;
    remarks: string;    
    course_contents?: ClassCourseContentModel[];
  }