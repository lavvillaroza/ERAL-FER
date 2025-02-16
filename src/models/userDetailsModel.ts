import { OnlineStatus } from "@/types/onlineStatus";

export interface UserDetailsModel {    
    user_id: number;
    name: string;
    course: string | null;
    online_status: OnlineStatus;
    profile_image: Buffer | null;
  }