/** @fileoverview Middleware for serving Swagger UI documentation. */

'use strict';

const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

/**
 * Initializes Swagger UI middleware.
 * @param {!Object} app Express application instance.
 */
module.exports = (app) => {
  const swaggerPath = './swagger_output.json';

  if (!fs.existsSync(swaggerPath)) {
    console.error(
        '❌ Error: swagger_output.json is not found. Run "npm run swagger" first.'
    );
    return;
  }

  /** @const {!Object} swaggerDocument Parsed Swagger JSON file. */
  const swaggerDocument = require('../swagger_output.json');

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
