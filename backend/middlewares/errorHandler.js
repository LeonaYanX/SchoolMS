// Error handler for centralized logging and sending responses
const errorHandler = (err, req, res, next) => {
    
        // Determining the error status (default is 500)
        const status = err.status || 500;
    
        // Standardized response format
        const errorResponse = {
            status: status,
            error: err.name || 'ServerError',
            message: err.message || 'An internal server error occurred'
        };
    
        // Error logging
        console.error(`[ERROR] ${err.name}: ${err.message}`);
    
        // Checking Error types and specifying the response 
        if (err.name === 'ValidationError') {
            errorResponse.status = 400;
            errorResponse.message = 'Validation failed for the provided input.';
        } else if (err.name === 'MongoError' && err.code === 11000) {
            errorResponse.status = 400;
            errorResponse.message = 'Duplicate key error: Unique field value already exists.';
        } else if (err.name === 'JsonWebTokenError') {
            errorResponse.status = 401;
            errorResponse.message = 'Invalid or expired token.';
        }
    
        // Отправляем стандартизированный ответ
        res.status(errorResponse.status).json(errorResponse);
    };
    
    module.exports = errorHandler;


