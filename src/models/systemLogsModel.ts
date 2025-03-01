

export interface SystemLogsModel {    
    id: number;
    timestamp: Date;
    level: string;
    message: string;
    exception: string;
    entity_name: string;
    user_id: number | 0;    
    for_admin: string | "N";
  }