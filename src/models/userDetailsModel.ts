export interface UserDetailsModel {    
    user_id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    course: string | null;
    online_status: string;
    profile_image: Buffer | null;
    thresh_hold: number | 0;
}