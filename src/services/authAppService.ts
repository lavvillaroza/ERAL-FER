// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerUser = async (userData: any) => {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
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
        throw new Error("AuthAppService @ registerUser API:" + error);
    }       
};

// ✅ Login User
export const loginUser = async (credentials: { email: string; password: string }) => {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
            credentials: 'include',
        });

        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("AuthAppService @ loginUser API:" + error);
    }      
};

export const refreshAuthToken = async () => {
    try {
        const response = await fetch('/api/auth/token/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Ensures cookies (refresh token) are sent        
        });

        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("AuthAppService @ refreshToken API:" + error);
    } 
}

// ✅ Logout User
export const logoutUser = async () => {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await response.json();
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("AuthAppService @ logoutUser API:" + error);
    } 
};

// ✅ Fetch Auth Token
export const getDecodedAuthToken = async () => {
    try {
        const response = await fetch('/api/auth/token', {
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
        throw new Error("AuthAppService @ getDecodedAuthToken API:" + error);
    } 
};



