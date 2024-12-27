// errorHandler.js

// Обработчик ошибок для централизованного логирования и отправки ответов
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);  // Логируем стек ошибки для отладки
    
    // Проверяем тип ошибки и на основе этого формируем ответ
    if (err.name === 'ValidationError') {
        // Ошибка валидации данных (например, валидация модели)
        return res.status(400).json({ message: 'Validation Error', details: err.errors });
    }

    if (err.name === 'MongoError' && err.code === 11000) {
        // Ошибка при уникальности данных (например, дублирование email)
        return res.status(400).json({ message: 'Duplicate Key Error', details: err.keyValue });
    }

    if (err.name === 'JsonWebTokenError') {
        // Ошибка JWT, если токен недействителен
        return res.status(401).json({ message: 'Invalid Token' });
    }

    // Если ошибка не была обработана выше, отправляем стандартный ответ
    res.status(500).json({ message: 'Something went wrong!', details: err.message });
};

module.exports = errorHandler;
