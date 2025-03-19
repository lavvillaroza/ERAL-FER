export interface UserTeacherThresholdModel {        
    id: number;
    user_id: number;    
    expression_type: string;
    message: string;
    threshold: number;
    updated_date: Date;    
}