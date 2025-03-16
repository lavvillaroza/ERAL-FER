export const getServerTime = async () => {        
    try {        
        const response = await fetch('/api/server-time');   
        const text = await response.text();        
        const result = JSON.parse(text);
        if (result.success === false) {
            throw new Error(result.message);
        }
        return result;
    }
    catch (error) {
        throw new Error("TimeAppService @ getServerTime API error:" + error);
    }  
};