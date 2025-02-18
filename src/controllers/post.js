import prisma from "../prisma.js";
import { PostSchema as ps } from "../models/post.js";
import { z } from 'zod';
import { logger } from "../helpers/logger.js";
import slugify from "slugify";

// @desc Create new post
// @route POST /api/post
export async function createPost ( req, res, next ) {
    let post;
    let message;

    try {
        logger.debug( 'Called createPost()...' );

        const validatedData = ps.parse( req.body );

        const slug = slugify( validatedData.title, {
            lower: true,
            strict: true,
            trim: true
        } );

        const existingPost = await prisma.post.findUnique( {
            where: { slug }
        } );

        if ( existingPost ) {
            message = `Post with title ${ existingPost.title } already exists`;
            logger.error( message );
            return res.status( 409 ).json( {
                success: false,
                message
            } );
        }

        const userId = req.user?.id;
        if ( !userId ) {
            message = 'Unauthorized: User must be logged in to fetch posts';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        try {
            post = await prisma.post.create( {
                data: {
                    title: validatedData.title,
                    content: validatedData.content,
                    tags: validatedData.tags,
                    slug: slug,
                    authorId: userId
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    content: true,
                    tags: true,
                    published: true,
                    createdAt: true,
                    author: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            } );
        } catch ( error ) {
            logger.error( 'Error during post creation:', error );
            throw error;
        }

        return res.status( 201 ).json( {
            success: true,
            message: 'Post created successfully',
            data: {
                post
            }
        } );

    } catch ( error ) {
        logger.error( 'Error calling createPost()...' );

        if ( error instanceof z.ZodError ) {
            message = 'Validation failed';
            logger.error( message );
            return res.status( 422 ).json( {
                success: false,
                message,
                errors: error.errors
            } );
        }

        if ( error.code === 'P2002' ) {
            message = 'Post with this title already exists';
            logger.error( message );
            return res.status( 409 ).json( {
                success: false,
                message
            } );
        }

        return next( error );
    }
}

// @desc Get user's post
// @route GET /api/posts/user
export async function fetchUserPosts ( req, res, next ) {
    let message;
    let posts;

    try {
        logger.debug( 'Called createPost()...' );

        const userId = req.user?.id;
        if ( !userId ) {
            message = 'Unauthorized: User must be logged in to fetch posts';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        try {
            posts = await prisma.post.findMany( {
                where: {
                    authorId: userId
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    content: true,
                    tags: true,
                    published: true,
                    likes: true,
                    dislikes: true,
                    saves: true,
                    createdAt: true,
                    updatedAt: true,
                }
            } );
        } catch ( error ) {
            logger.error( 'Error during fetching posts:', error );
            throw error;
        }

        return res.status( 200 ).json( {
            success: true,
            message: 'Posts fetched successfully',
            data: {
                posts,
            }
        } );

    } catch ( error ) {
        logger.error( 'Error calling fetchUserPosts()...' );

        return next( error );
    }
}
