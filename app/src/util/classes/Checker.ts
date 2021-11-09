import { CustomErrorMessage } from "../../types/errors";
import { NodeEnvsEnum } from "../../types/misc";

class Checker {
    // Check whether all expected environment
    // variables are set correctly
    static checkEnvironment() {
        // An array with potential errors
        const errors: CustomErrorMessage[] = [];
        
        const {
            NODE_ENV,
            TOKEN_KEY,
            DB_NAME,
            DB_USER,
            DB_PASSWORD,
            PORT,
            ELASTIC_HOST,
            ELASTIC_URL,
        } = process.env;
    
        // An utility function not to repeat myself
        // when pushing new error
        const pushNewError = (
            field: string,
            message: string = 'Environment variable is not defined'
        ) => {
            errors.push({
                message, field
            });
        }
    
        // NODE_ENV
        if (!NODE_ENV)
            pushNewError('NODE_ENV')
        else if (!Object.keys(NodeEnvsEnum).includes(NODE_ENV))
            pushNewError(
                'NODE_ENV',
                'Unknown NODE_ENV value'
            )
    
        // Elasticsearch related variables
        if (!ELASTIC_HOST)
            pushNewError('ELASTIC_HOST')
        if (!ELASTIC_URL)
            pushNewError('ELASTIC_URL')
    
        // MySQL related variables
        if (!DB_NAME)
            pushNewError('DB_NAME')
        if (!DB_USER)
            pushNewError('DB_USER')
        if (!DB_PASSWORD)
            pushNewError('DB_PASSWORD')
    
        // Other
        if (!TOKEN_KEY)
            pushNewError('TOKEN_KEY')
    
        if (!PORT)
            pushNewError('PORT')
        else if (isNaN(+PORT))
            pushNewError(
                'PORT',
                'Variable should be numeric'
            )
    
        // Throw error if there are errors with
        // environment variables
        if (errors.length) throw new Error(JSON.stringify(errors));
    }
}

export { Checker };