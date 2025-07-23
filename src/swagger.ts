// src/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation',
        },
    },
    apis: ['./src/*.ts'], // adjust path to your routes(in my case only server.ts)
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
