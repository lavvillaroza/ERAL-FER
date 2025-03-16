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
        throw new Error("UserAppService @ getUsersByUserId API error:" + error);
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
        throw new Error("UserAppService @ getClassStudents API error:" + error);
    }    
};

export const getUsersByUserId = async (user_id: number) => {        
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
        throw new Error("UserAppService @ getUsersByUserId API error:" + error);
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
        throw new Error("UserAppService @ getUsersByUserId API error:" + error);
    }  
};



