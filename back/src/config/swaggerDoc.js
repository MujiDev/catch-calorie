import swaggerJsDoc from "swagger-jsdoc";

const swaggerDefinition = {
    info: {
        title: "Catch Calorie",
        version: "1.0.0",
        description: "Catch Calorie API 명세서"
    },
    host: "http://localhost/3000",
    basePath: "/"
};

const options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['/.../routers/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

export { swaggerSpec };

//index.js
//import swaggerUi from 'swagger-ui-express';
//import { swaggerSpec } from './config/swaggerDoc'
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))