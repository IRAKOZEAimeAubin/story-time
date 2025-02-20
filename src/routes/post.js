import express from 'express';
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { createPost, publishPost, togglePostDislike, togglePostLike, togglePostSave, updatePost } from '../controllers/post.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing blog posts
 */

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

/**
 * @swagger
 * /api/post/{id}/publish:
 *   patch:
 *     summary: Publish or unpublish a post
 *     description: Publish or unpublish a post. Only the author of the post can perform this action.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to publish/unpublish.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - published
 *             properties:
 *               published:
 *                 type: boolean
 *                 example: true
 *                 description: Whether the post should be published or unpublished.
 *     responses:
 *       200:
 *         description: Post published/unpublished successfully
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
 *                   example: Post published successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     post:
 *                       $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized - User must be logged in
 *       403:
 *         description: Forbidden - User is not the author of the post
 *       404:
 *         description: Post not found
 *       422:
 *         description: Validation error - Published field must be a boolean
 */
router.patch( '/:id/publish', authenticateUser, publishPost );

/**
 * @swagger
 * /api/post/{id}/like:
 *   post:
 *     summary: Like or unlike a post
 *     description: Like or unlike a post. Only published posts can be liked.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to like/unlike.
 *     responses:
 *       200:
 *         description: Post liked/unliked successfully
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
 *                   example: User added like
 *                 data:
 *                   type: object
 *                   properties:
 *                     postId:
 *                       type: string
 *                       example: cl1234567890abcdef
 *                     liked:
 *                       type: boolean
 *                       example: true
 *                     likeCount:
 *                       type: integer
 *                       example: 1
 *                     dislikeCount:
 *                       type: integer
 *                       example: 0
 *       401:
 *         description: Unauthorized - User must be logged in
 *       403:
 *         description: Forbidden - Post is not published
 *       404:
 *         description: Post not found
 */
router.post( '/:id/like', authenticateUser, togglePostLike );

/**
 * @swagger
 * /api/post/{id}/dislike:
 *   post:
 *     summary: Dislike or undislike a post
 *     description: Dislike or undislike a post. Only published posts can be disliked.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to dislike/undislike.
 *     responses:
 *       200:
 *         description: Post disliked/undisliked successfully
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
 *                   example: User added dislike
 *                 data:
 *                   type: object
 *                   properties:
 *                     postId:
 *                       type: string
 *                       example: cl1234567890abcdef
 *                     disliked:
 *                       type: boolean
 *                       example: true
 *                     likeCount:
 *                       type: integer
 *                       example: 0
 *                     dislikeCount:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized - User must be logged in
 *       403:
 *         description: Forbidden - Post is not published
 *       404:
 *         description: Post not found
 */
router.post( '/:id/dislike', authenticateUser, togglePostDislike );

/**
 * @swagger
 * /api/post/{id}/save:
 *   post:
 *     summary: Save or unsave a post
 *     description: Save or unsave a post. Only published posts can be saved.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to save/unsave.
 *     responses:
 *       200:
 *         description: Post saved/unsaved successfully
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
 *                   example: User saved post
 *                 data:
 *                   type: object
 *                   properties:
 *                     postId:
 *                       type: string
 *                       example: cl1234567890abcdef
 *                     saved:
 *                       type: boolean
 *                       example: true
 *                     saveCount:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized - User must be logged in
 *       403:
 *         description: Forbidden - Post is not published
 *       404:
 *         description: Post not found
 */
router.post( '/:id/save', authenticateUser, togglePostSave );

/**
 * @swagger
 * /api/post/{id}:
 *   patch:
 *     summary: Update a post
 *     description: Update the title, content, tags, or publishing status of a post. Only the author of the post can perform this action.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Title
 *               content:
 *                 type: string
 *                 example: Updated content...
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["updated", "tags"]
 *               published:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       401:
 *         description: Unauthorized - User must be logged in
 *       403:
 *         description: Forbidden - User is not the author of the post
 *       404:
 *         description: Post not found
 *       422:
 *         description: Validation error - Invalid input data
*/
router.patch( '/:id', authenticateUser, updatePost );

export default router;
