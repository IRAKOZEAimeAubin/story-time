import prisma from "../prisma.js";
import { PostSchema as ps } from "../models/post.js";
import { z } from 'zod';
import { logger } from "../helpers/logger.js";
import slugify from "slugify";

// @desc Create new post
// @route POST /api/post
export async function createPost ( req, res, next ) {
    let post;
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
            const message = `Post with title ${ existingPost.title } already exists`;
            logger.error( message );
            return res.status( 409 ).json( {
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
                    authorId: req.user.id
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
            data: {
                post
            }
        } );

    } catch ( error ) {
        logger.error( 'Error calling createPost()...' );

        if ( error instanceof z.ZodError ) {
            return res.status( 422 ).json( {
                success: false,
                message: 'Validation failed',
                errors: error.errors
            } );
        }

        if ( error.code === 'P2002' ) {
            return res.status( 409 ).json( {
                success: false,
                message: 'Post with this title already exists'
            } );
        }

        return next( error );
    }
}