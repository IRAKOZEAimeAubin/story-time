import express from 'express';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Root
 *   description: API for getting information about the application
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API information
 *     description: Returns welcome message, API version, environment details, and available endpoints.
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to Story Time
 *                   description: A welcome message for the API.
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                   description: The current version of the API.
 *                 environment:
 *                   type: string
 *                   example: development
 *                   description: The environment in which the API is running (e.g., development, production).
 *                 nodeVersion:
 *                   type: string
 *                   example: v18.12.1
 *                   description: The version of Node.js running the API.
 *                 platform:
 *                   type: string
 *                   example: linux
 *                   description: The platform on which the API is running (e.g., linux, win32).
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     auth:
 *                       type: object
 *                       properties:
 *                         register:
 *                           type: string
 *                           example: POST /api/auth/register
 *                           description: Endpoint for user registration.
 *                         login:
 *                           type: string
 *                           example: POST /api/auth/login
 *                           description: Endpoint for user login.
 *                     health:
 *                       type: string
 *                       example: GET /health
 *                       description: Endpoint for checking server health.
 *                 documentation:
 *                   type: string
 *                   example: https://example.com/api-docs
 *                   description: Link to the API documentation.
 */
router.get( '/', ( req, res ) => {
    res.status( 200 ).json( {
        message: 'Welcome to Story Time',
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        platform: process.platform,
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login'
            },
            health: 'GET /health'
        },
        documentation: process.env.API_DOCS
    } );
} );

export default router;