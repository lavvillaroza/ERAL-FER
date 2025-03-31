// ✅ Fetch User and User Details
export const getNewAccountNotifications = async () => {
    try {        
        const response = await fetch(`/api/notification/for-admin`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            } 
        });
        const result = await response.json();
        console.log(result.data);
        
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("NotificaiontsAppService @ getNewAccountNotifications API:" + error);
    }      
};