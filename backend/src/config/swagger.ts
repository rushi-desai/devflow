import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DevFlow API",
      version: "1.0.0",
      description: "Project Management Backend API",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["src/routes/*.ts"], // Read Swagger comments from route files
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };