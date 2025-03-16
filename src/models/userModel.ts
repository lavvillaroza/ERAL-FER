import { UserDetailsModel } from "./userDetailsModel";

export interface UserModel {
    user_id: number;
    email: string;
    password: string;
    role: string;
    account_status: string;    
    created_date: Date;
    updated_date: Date;
    userDetails: UserDetailsModel;
  }