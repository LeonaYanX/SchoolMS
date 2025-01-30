//CORS Settings 
const corsOptions = {
    origin: ['https://trusted-domain.com', 'https://another-trusted.com'], // Trusted domains
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'Access-Control-Allow-Credentials',
        'X-Requested-With',
        'Referrer-Policy',
        'X-Frame-Options',
        'X-Debug-Info'], // Allowed headers
    credentials: true, //If we need to send cookies
  };
  module.exports = corsOptions;