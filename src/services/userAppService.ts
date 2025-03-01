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
