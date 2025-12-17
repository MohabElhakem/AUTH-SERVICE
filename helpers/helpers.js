exports.get_meta_request=(req)=>{
    try {
        const ipAdress = 
            req?.ip ||
            req?.header?.['x-forwarded-for']?.split(',')?.[0] ||
            req?.socket?.remoteAddress ||
            'UNKNOWN_IP_ADDRESS'
    
        const userAgent =
            req?.get?.['user-agent']||
            req?.header?.['user-agent ']||
            "UNKNOWN_USER_AGENT"
    
        return {
            ipAdress,
            userAgent
        }
    } catch (error) {
        // Absolute fallback in case of unexpected errors
        return {
            ipAdress: 'UNKNOWN_IP_ADDRESS',
            userAgent: 'UNKNOWN_USER_AGENT'
        };
    }
}