import { UserDetailsModel } from "./userDetailsModel";

export interface ClassStudentModel {
  id: number;
  class_subject_id: number;
  student_id: number;    
  student_details: UserDetailsModel;
}