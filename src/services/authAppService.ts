// ✅ Register User
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerUser = async (userData: any) => {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

// ✅ Login User
export const loginUser = async (credentials: { email: string; password: string }) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // 🔹 Important for session-based authentication
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

// ✅ Logout User
export const logoutUser = async () => {
    const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

// ✅ Fetch User Role
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
