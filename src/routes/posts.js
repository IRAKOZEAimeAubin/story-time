import express from 'express';
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { fetchUserPosts } from '../controllers/post.js';

const router = express.Router();

/**
 * @swagger
 * /api/posts/user:
 *   get:
 *     summary: Fetch posts created by the authenticated user
 *     description: Returns all posts created by the currently logged-in user.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Posts fetched successfully
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
 *                   example: Posts fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     posts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: cl1234567890abcdef
 *                           title:
 *                             type: string
 *                             example: My First Post
 *                           slug:
 *                             type: string
 *                             example: my-first-post
 *                           content:
 *                             type: string
 *                             example: This is the content of my first post.
 *                           tags:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["blog", "tutorial"]
 *                           published:
 *                             type: boolean
 *                             example: true
 *                           likes:
 *                             type: integer
 *                             example: 0
 *                           dislikes:
 *                             type: integer
 *                             example: 0
 *                           saves:
 *                             type: integer
 *                             example: 0
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2023-10-25T12:34:56.789Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2023-10-25T12:34:56.789Z
 *       401:
 *         description: Unauthorized - User must be logged in to fetch posts
 */
router.get( '/user', authenticateUser, fetchUserPosts );

export default router;
