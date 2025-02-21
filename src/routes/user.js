import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { fetchDislikedPosts, fetchLikedPosts, fetchSavedPosts, fetchUserProfile } from "../controllers/user.js";

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

/**
 * @swagger
 * /api/user/posts/liked:
 *   get:
 *     summary: Fetch posts liked by the authenticated user
 *     description: Fetch all posts that the authenticated user has liked.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liked posts fetched successfully
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
 *                   example: Liked posts fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     posts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized - User must be logged in
 */
router.get( '/posts/liked', authenticateUser, fetchLikedPosts );

/**
 * @swagger
 * /api/user/posts/disliked:
 *   get:
 *     summary: Fetch posts disliked by the authenticated user
 *     description: Fetch all posts that the authenticated user has disliked.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Disliked posts fetched successfully
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
 *                   example: Disliked posts fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     posts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized - User must be logged in
 */
router.get( '/posts/disliked', authenticateUser, fetchDislikedPosts );

/**
 * @swagger
 * /api/user/posts/saved:
 *   get:
 *     summary: Fetch posts saved by the authenticated user
 *     description: Fetch all posts that the authenticated user has saved.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saved posts fetched successfully
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
 *                   example: Saved posts fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     posts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized - User must be logged in
 */
router.get( '/posts/saved', authenticateUser, fetchSavedPosts );

export default router;
