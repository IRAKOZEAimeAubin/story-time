import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { fetchUserProfile } from "../controllers/user.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API for user management
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Fetch the authenticated user's profile
 *     description: Returns the profile of the currently logged-in user, including their name, email, and counts of liked, disliked, and saved posts.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User profile fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: cl1234567890abcdef
 *                         name:
 *                           type: string
 *                           example: John Doe
 *                         email:
 *                           type: string
 *                           example: john.doe@example.com
 *                         _count:
 *                           type: object
 *                           properties:
 *                             likedPosts:
 *                               type: integer
 *                               example: 5
 *                             dislikedPosts:
 *                               type: integer
 *                               example: 2
 *                             savedPosts:
 *                               type: integer
 *                               example: 3
 *       401:
 *         description: Unauthorized - User must be logged in
 *       404:
 *         description: Not Found - User not found
 */
router.get( '/', authenticateUser, fetchUserProfile );

export default router;
