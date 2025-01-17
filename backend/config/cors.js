//Настройка CORS  
const corsOptions = {
    origin: ['https://trusted-domain.com', 'https://another-trusted.com'], // Доверенные домены
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешённые методы
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'Access-Control-Allow-Credentials',
        'X-Requested-With',
        'Referrer-Policy',
        'X-Frame-Options',
        'X-Debug-Info'], // Разрешённые заголовки
    credentials: true, // Если нужно отправлять cookie
  };
  module.exports = corsOptions;