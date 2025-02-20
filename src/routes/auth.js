import express from 'express';
import { login, register } from '../controllers/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API for authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *      summary: Register a new user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - email
 *                          - name
 *                          - password
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                              description: The user's email address
 *                          name:
 *                              type: string
 *                              description: The user's full name
 *                          password:
 *                              type: string
 *                              format: password
 *                              description: The user's password
 *      responses:
 *          201:
 *              description: User created successfully
 *          409:
 *              description: User already exists
 *          422:
 *              description: Validation error
 */
router.post( '/register', register );

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      summary: Log in a user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - email
 *                          - password
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                              description: The user's email address
 *                          password:
 *                              type: string
 *                              format: password
 *                              description: The user's password
 *      responses:
 *          200:
 *              description: User logged in successfully
 *          401:
 *              description: Invalid credentials
 *          422:
 *              description: Validation error
 */
router.post( '/login', login );

export default router;
