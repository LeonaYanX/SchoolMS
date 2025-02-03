/*const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'School Management System API',
    version: '1.0.0',
    description: 'API documentation for School Management System',
  },
  servers: [
    {
      url: 'http://localhost:3000' , 
      description: 'local host 3000',
    },
    {
      url: 'http://localhost:3333' , 
      description: 'local host 3333',
    },
    {
      url: 'http://localhost:5500' , 
      description: 'local host 5500',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['../routs/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
console.log('Swagger spec:', swaggerSpec);
module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
*/

const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'School Management API',
        description: 'API documentation for School Management System',
    },
    host: `localhost:${process.env.PORT}`, 
    schemes: ['http' , 'https'], 
};

const outputFile = '../swagger_output.json'; // File to save generated documentation 
const endpointsFiles = ['../index.js', '../routs/userRoutes.js',
   '../routs/authRoutes.js', '../routs/adminRoutes.js',
    '../routs/teacherRouts.js']; // route files

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger JSON сгенерирован!');
});


