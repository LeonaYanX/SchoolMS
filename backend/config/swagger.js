/** @fileoverview Swagger documentation generator configuration. */

'use strict';

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'School Management API',
    description: 'API documentation for the School Management System',
  },
  host: `localhost:${process.env.PORT}`,
  schemes: ['http', 'https'],
};

/** @const {string} outputFile Path to save generated documentation. */
const outputFile = '../swagger_output.json';

/** @const {!Array<string>} endpointsFiles Route files to be documented. */
const endpointsFiles = [
  '../index.js',
  '../routes/userRoutes.js',
  '../routes/authRoutes.js',
  '../routes/adminRoutes.js',
  '../routes/teacherRoutes.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger JSON successfully generated!');
});
