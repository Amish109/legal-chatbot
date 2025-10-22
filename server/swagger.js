// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Legal-AI API',
      version: '1.0.0',
      description: 'API documentation for Legal-AI backend',
    },
    servers: [
      {
        url: 'http://localhost:4000/api', // base URL
      },
    ],
  },
  apis: ['./routes/*.js'], // path to your route files (where Swagger comments will be)
};

const swaggerSpec = swaggerJsDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
