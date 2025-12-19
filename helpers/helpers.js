const constants = require('../config/constants');
const searchMap = require('../config/searchmap').searchMap;
const bcrypt = require('bcrypt');



exports.get_meta_request=(req)=>{
    try {
        const ipAdress = 
            req?.ip ||
            req?.header?.['x-forwarded-for']?.split(',')?.[0] ||
            req?.socket?.remoteAddress ||
            'UNKNOWN_IP_ADDRESS'
    
        const userAgent =
            req?.get?.['user-agent']||
            req?.header?.['user-agent']||
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


// A glopel search function in the data base
exports.Search_By = async(model , field , value) =>{

    try {
        console.log ("start the search funtion")
        // make sure nothing is missing 
        if (!model || !field || !value)  throw new Error("Model, field, and value are required for search");
        const config = searchMap;
        const modelConfig = config[model];  //if the model isn't defined in the searchMap it will return undifiend 
    
        // first case unsearchable Model
        if(!modelConfig) throw new Error(`Model: ${model} is not Allowed to be searched`);
    
        // seconed case unsercable field
        if(!modelConfig.fieldsToSearch.includes(field)) {
            throw new Error (`Filed: ${field} is not searchable in ${model}`);
        }

        //now every thing is okay for the search so get me the results
        const searchResult = await modelConfig.model.findOne({[field]:value}).lean();
        console.log("found the result")
        return {
            found: true ,
            data: searchResult,
        }
    } catch (error) {
        console.log("Search_BY error occured", error)
        return{
            found: false,
            data : null
        }
    }
    // it returns an object with founded true or false and the result or the error message
}

// A password validating function
exports.Validate_Password = async (plain, hashed) => {
    if(!plain || !hashed) throw new Error("Both plain and hashed passwords are required for validation");
    return await bcrypt.compare(plain, hashed);
}// this Function return boolean value true or false
