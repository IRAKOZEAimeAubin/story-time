import swaggerJSDoc from "swagger-jsdoc";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Story Time API with Swagger',
            version: '1.0.0',
            description: 'This is a simple blog application made with Express and documented with Swagger'
        },
        servers: [
            {
                url: 'http://localhost:9003',
                description: 'Local server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: [ join( __dirname, '../routes/*.js' ) ]
};

const swaggerSpec = swaggerJSDoc( options );

export default swaggerSpec;
