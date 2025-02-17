import express from 'express';
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { createPost } from '../controllers/post.js';

const router = express.Router();

router.post( '/', authenticateUser, createPost );

export default router;
