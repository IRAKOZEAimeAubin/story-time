import express from 'express';
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { createPost, publishPost } from '../controllers/post.js';

const router = express.Router();

/**
 * @swagger
 * /api/post:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post with a title, content, tags, and other optional fields.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - tags
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *                 example: My First Post
 *                 description: The title of the post.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 maxItems: 5
 *                 example: ["blog", "tutorial"]
 *                 description: Tags associated with the post.
 *               content:
 *                 type: string
 *                 minLength: 10
 *                 example: This is the content of my first post.
 *                 description: The content of the post.
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     post:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: cl1234567890abcdef
 *                         title:
 *                           type: string
 *                           example: My First Post
 *                         slug:
 *                           type: string
 *                           example: my-first-post
 *                         content:
 *                           type: string
 *                           example: This is the content of my first post.
 *                         tags:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["blog", "tutorial"]
 *                         published:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2023-10-25T12:34:56.789Z
 *                         author:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: cl0987654321abcdef
 *                             name:
 *                               type: string
 *                               example: John Doe
 *       401:
 *         description: Unauthorized - User must be logged in to create a post
 *       409:
 *         description: Conflict - Post with this title already exists
 *       422:
 *         description: Validation error - Invalid input data
 */
router.post( '/', authenticateUser, createPost );

router.patch( '/:id/publish', authenticateUser, publishPost );

export default router;
