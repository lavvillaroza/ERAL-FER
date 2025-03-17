import { UserModel } from "@/models/userModel";

// ✅ Fetch User and User Details
export const getUserRole = async () => {
    try {
        const response = await fetch('/api/auth/role', {
            method: 'GET',
            credentials: 'include',
        });

        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("UserAppService @ getUsersByUserId API:" + error);
    }      
};


export const getUsersByRole = async (role: string) => {
    try {
        const response = await fetch(`/api/user/role/${role}`, {
            method: 'GET',
            credentials: 'include', // ✅ Ensure cookies are sent if needed
            headers: {
                'Content-Type': 'application/json'
            }        
        });    
        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("UserAppService @ getClassStudents API:" + error);
    }    
};

export const getUsersDetailsByRole = async (role: string) => {
    try {
        const response = await fetch(`/api/user/role/${role}/user-details`, {
            method: 'GET',
            credentials: 'include', // ✅ Ensure cookies are sent if needed
            headers: {
                'Content-Type': 'application/json'
            }        
        });    
        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("UserAppService @ getClassStudents API:" + error);
    }    
};

export const getUserByUserId = async (user_id: number) => {        
    try {
        const response = await fetch(`/api/user/${user_id}`, {
            method: 'GET',
            credentials: 'include', // ✅ Ensure cookies are sent if needed
            headers: {
                'Content-Type': 'application/json'
            }        
        });   
        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("UserAppService @ getUsersByUserId API:" + error);
    }  
};

export const getUserDetailsByUserId = async (user_id: number) => {        
    try {
        const response = await fetch(`/api/user/${user_id}/details`, {
            method: 'GET',
            credentials: 'include', // ✅ Ensure cookies are sent if needed
            headers: {
                'Content-Type': 'application/json'
            }        
        });   
        const result = await response.json();        
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("UserAppService @ getUserDetailsByUserId API:" + error);
    }  
};

export const updateUserStatusByUserId = async (user_id: number, new_status: string) => {
    try {
        const response = await fetch(`/api/user/${user_id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user_id: user_id, account_status: new_status}),
            credentials: 'include',
        });

        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("UserAppService @ updateUserStatusByUserId API:" + error);
    }      

}

export const updateUserDetailsByUserId = async (user_id: number, userData: UserModel) => {
    try {
        const response = await fetch(`/api/user/${user_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            credentials: 'include',
        });

        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("UserAppService @ updateUserDetailsByUserId API:" + error);
    }      

}


export const updateUserPasswordByUserId = async (user_id: number, cur_password: string, new_password: string) => {
    try {
        const response = await fetch(`/api/user/${user_id}/password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({cur_password: cur_password, new_password: new_password}),
            credentials: 'include',
        });

        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }

        return result;
    }
    catch (error) {
        throw new Error("UserAppService @ updateUserDetailsByUserId API:" + error);
    }      

}


