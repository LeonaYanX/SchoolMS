const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

module.exports = (app) => {
    const swaggerPath = './swagger_output.json';

    if (!fs.existsSync(swaggerPath)) {
        console.error('❌ Error: swagger_output.json is not found. Run "npm run swagger" first.');
        return;
    }

    const swaggerDocument = require('../swagger_output.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
