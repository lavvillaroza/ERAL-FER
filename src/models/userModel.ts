import { UserDetailsModel } from "./userDetailsModel";

export interface UserModel {
    user_id: number;
    email: string;
    password: string;
    role: string;
    account_status: string;    
    userDetails: UserDetailsModel;
  }