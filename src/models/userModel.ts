import { AccountStatus } from "@/types/accountStatus";
import { UserRole } from "@/types/userRole";

export interface UserModel {
    user_id: number;
    email: string;
    password: string;
    role: UserRole;
    account_status: AccountStatus;
  }