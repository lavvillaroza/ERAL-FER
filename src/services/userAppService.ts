// ✅ Fetch User and User Details
export const getUserRole = async () => {
    const response = await fetch('/api/auth/role', {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};


export const getUsersByRole = async (role: string) => {
    const response = await fetch(`/api/user/role/${role}`, {
        method: 'GET',
        credentials: 'include', // ✅ Ensure cookies are sent if needed
        headers: {
            'Content-Type': 'application/json'
        }        
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return data;
};

export const getUsersByUserId = async (user_id: number) => {    
    const response = await fetch(`/api/user/${user_id}`, {
        method: 'GET',
        credentials: 'include', // ✅ Ensure cookies are sent if needed
        headers: {
            'Content-Type': 'application/json'
        }        
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return data;
};


