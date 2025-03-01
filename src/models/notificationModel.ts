export interface NotificationModel {    
    id: number;
    datetime_stamp: Date;
    title: string;
    message: string;
    user_id: number | 0;
    color_code: string;
    status: number | 0;
    for_admin: string | "N";
  }