import swaggerUI from "swagger-ui-express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Catch Calorie API",
        version: "1.0.0",
        description: "Website Catch Calorie API",
        termsOfService: "http://example.com/terms/",
        contact: {
          name: "API Support",
          url: "http://www.exmaple.com/support",
          email: "support@example.com",
        },
      },
  
      servers: [
        {
          url: "http://localhost:5002",
          description: "My API Documentation",
        },
      ],
    },
    apis: ["./src/routers/*.js"],
  };
  
  const specs = swaggerJsDoc(options);

  module.exports = { 
    swaggerUi, 
    specs 
};
  