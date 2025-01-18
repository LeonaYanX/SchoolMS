// Обработчик ошибок для централизованного логирования и отправки ответов
const errorHandler = (err, req, res, next) => {
    
        // Определяем статус ошибки (по умолчанию 500)
        const status = err.status || 500;
    
        // Формат стандартизированного ответа
        const errorResponse = {
            status: status,
            error: err.name || 'ServerError',
            message: err.message || 'An internal server error occurred'
        };
    
        // Логируем ошибку
        console.error(`[ERROR] ${err.name}: ${err.message}`);
    
        // Проверяем типы ошибок и уточняем ответ
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


