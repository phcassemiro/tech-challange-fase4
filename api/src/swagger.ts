// src/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Tech Challenge',
      version: '1.0.0',
      description: 'Documentação da API',
    },
  },
  apis: ['./src/controllers/postController.ts', './src/controllers/authController.ts'], // atualizado para .ts
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerDocs;