import prisma from "../prisma.js";
import { PostSchema as ps, PublishPostSchema as pps, UpdatePostSchema as ups } from "../models/post.js";
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
            message = `Conflict: Post with title ${ existingPost.title } already exists`;
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
            message = 'Unprocessable Entity: Invalid data';
            logger.error( message );
            return res.status( 422 ).json( {
                success: false,
                message,
                errors: error.errors
            } );
        }

        if ( error.code === 'P2002' ) {
            message = 'Conflict: Post with this title already exists';
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
        logger.debug( 'Called fetchUserPosts()...' );

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
                    author: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    likes: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            createdAt: true,
                        }
                    },
                    dislikes: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            createdAt: true,
                        }
                    },
                    saves: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            likes: true,
                            dislikes: true,
                            saves: true
                        }
                    },
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

// @desc Get user's post
// @route GET /api/posts
export async function fetchPublishedPosts ( req, res, next ) {
    let message;
    let posts;

    try {
        logger.debug( 'Called fetchPublishedPosts()...' );

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
                    published: true
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    content: true,
                    tags: true,
                    published: true,
                    author: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    likes: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            createdAt: true,
                        }
                    },
                    dislikes: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            createdAt: true,
                        }
                    },
                    saves: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            likes: true,
                            dislikes: true,
                            saves: true
                        }
                    },
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
        logger.error( 'Error calling fetchPublishedPosts()...' );

        return next( error );
    }
}

// @desc Publish or Unpublish a post
// @route PATCH /api/post/:id/publish
export async function publishPost ( req, res, next ) {
    let message;
    let updatedPost;

    try {
        logger.debug( 'Called publishPost()...' );

        const { published } = pps.parse( req.body );

        const postId = req.params.id;
        const post = await prisma.post.findUnique( {
            where: { id: postId },
            select: { authorId: true }
        } );
        if ( !post ) {
            message = `Not Found: Post with id ${ postId } not found`;
            logger.error( message );
            return res.status( 404 ).json( {
                success: false,
                message
            } );
        }

        const userId = req.user?.id;
        if ( !userId ) {
            message = 'Unauthorized: User must be logged in to publish/unpublish post';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        if ( post.authorId !== userId ) {
            message = 'Forbidden: You do not have permission to publish/unpublish this post';
            logger.error( message );
            return res.status( 403 ).json( {
                success: false,
                message
            } );
        }

        try {
            updatedPost = await prisma.post.update( {
                where: { id: postId },
                data: {
                    published
                }
            } );
        } catch ( error ) {
            logger.error( 'Error during post publishing/unpublishing:', error );
            throw error;
        }

        return res.status( 200 ).json( {
            success: true,
            message: published ? 'Post published successfully' : 'Post unpublished successfully',
            data: {
                post: updatedPost
            },
        } );

    } catch ( error ) {
        logger.error( 'Error calling publishPost()...' );

        if ( error instanceof z.ZodError ) {
            return res.status( 422 ).json( {
                success: false,
                message: 'Unprocessable Entity: Invalid data',
                errors: error.errors,
            } );
        }

        if ( error.code === 'P2025' ) {
            return res.status( 404 ).json( {
                success: false,
                message: 'Not Found: Post not found',
            } );
        }

        return next( error );
    }
}

// @desc Add or remove a like to a post
// @route POST /api/post/:id/like
export async function togglePostLike ( req, res, next ) {
    let message;
    let likedPost;

    try {
        logger.debug( 'Called togglePostLike()...' );

        const postId = req.params.id;
        const post = await prisma.post.findUnique( {
            where: { id: postId },
            select: { published: true }
        } );
        if ( !post ) {
            message = `Not Found: Post with id ${ postId } not found`;
            logger.error( message );
            return res.status( 404 ).json( {
                success: false,
                message
            } );
        }

        const userId = req.user?.id;
        if ( !userId ) {
            message = 'Unauthorized: User must be logged in to like a post';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        if ( !post.published ) {
            message = 'Forbidden: User can only like a published post';
            logger.error( message );
            return res.status( 403 ).json( {
                success: false,
                message
            } );
        }

        const [ existingLike, existingDislike ] = await Promise.all( [
            prisma.postLike.findUnique( {
                where: {
                    postId_userId: {
                        postId,
                        userId
                    }
                }
            } ),
            prisma.postDislike.findUnique( {
                where: {
                    postId_userId: {
                        postId,
                        userId
                    }
                }
            } )
        ] );

        try {
            likedPost = await prisma.$transaction( async ( tx ) => {
                if ( existingLike ) {
                    await tx.postLike.delete( {
                        where: {
                            postId_userId: {
                                postId,
                                userId
                            }
                        }
                    } );

                    return {
                        action: 'removed like',
                    };
                } else {
                    if ( existingDislike ) {
                        await tx.postDislike.delete( {
                            where: {
                                postId_userId: { postId, userId }
                            }
                        } );
                    }

                    await tx.postLike.create( {
                        data: {
                            postId,
                            userId
                        }
                    } );

                    const [ likes, dislikes ] = await Promise.all( [
                        tx.postLike.count( { where: { postId } } ),
                        tx.postDislike.count( { where: { postId } } )
                    ] );

                    return {
                        action: 'added like',
                        counts: { likes, dislikes }
                    };
                }
            } );

        } catch ( error ) {
            logger.error( 'Error during post liking:', error );
            throw error;
        }

        res.status( 200 ).json( {
            success: true,
            message: `User ${ likedPost.action }`,
            data: {
                postId,
                liked: likedPost.action === 'added like',
                likeCount: likedPost.counts.likes ?? 0,
                dislikeCount: likedPost.counts.dislikes ?? 0
            }
        } );

    } catch ( error ) {
        logger.error( 'Error calling togglePostLike()...' );

        if ( error.code === 'P2025' ) {
            return res.status( 404 ).json( {
                success: false,
                message: 'Not Found: Post not found',
            } );
        }

        return next( error );
    }
}

// @desc Add or remove a like to a post
// @route POST /api/post/:id/dislike
export async function togglePostDislike ( req, res, next ) {
    let message;
    let dislikedPost;

    try {
        logger.debug( 'Called togglePostDislike()...' );

        const postId = req.params.id;
        const post = await prisma.post.findUnique( {
            where: { id: postId },
            select: { published: true }
        } );
        if ( !post ) {
            message = `Not Found: Post with id ${ postId } not found`;
            logger.error( message );
            return res.status( 404 ).json( {
                success: false,
                message
            } );
        }

        const userId = req.user?.id;
        if ( !userId ) {
            message = 'Unauthorized: User must be logged in to dislike a post';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        if ( !post.published ) {
            message = 'Forbidden: User can only dislike a published post';
            logger.error( message );
            return res.status( 403 ).json( {
                success: false,
                message
            } );
        }

        const [ existingLike, existingDislike ] = await Promise.all( [
            prisma.postLike.findUnique( {
                where: {
                    postId_userId: {
                        postId,
                        userId
                    }
                }
            } ),
            prisma.postDislike.findUnique( {
                where: {
                    postId_userId: {
                        postId,
                        userId
                    }
                }
            } )
        ] );

        try {
            dislikedPost = await prisma.$transaction( async ( tx ) => {
                if ( existingDislike ) {
                    await tx.postDislike.delete( {
                        where: {
                            postId_userId: {
                                postId,
                                userId
                            }
                        }
                    } );

                    return {
                        action: 'removed dislike',
                    };
                } else {
                    if ( existingLike ) {
                        await tx.postLike.delete( {
                            where: {
                                postId_userId: { postId, userId }
                            }
                        } );
                    }

                    await tx.postDislike.create( {
                        data: {
                            postId,
                            userId
                        }
                    } );

                    const [ likes, dislikes ] = await Promise.all( [
                        tx.postLike.count( { where: { postId } } ),
                        tx.postDislike.count( { where: { postId } } )
                    ] );

                    return {
                        action: 'added dislike',
                        counts: { likes, dislikes }
                    };
                }
            } );

        } catch ( error ) {
            logger.error( 'Error during post disliking:', error );
            throw error;
        }

        res.status( 200 ).json( {
            success: true,
            message: `User ${ dislikedPost.action }`,
            data: {
                postId,
                disliked: dislikedPost.action === 'added dislike',
                likeCount: dislikedPost.counts.likes ?? 0,
                dislikeCount: dislikedPost.counts.dislikes ?? 0
            }
        } );

    } catch ( error ) {
        logger.error( 'Error calling togglePostDislike()...' );

        if ( error.code === 'P2025' ) {
            return res.status( 404 ).json( {
                success: false,
                message: 'Not Found: Post not found',
            } );
        }

        return next( error );
    }
}

// @desc Save or unsave a post
// @route POST /api/post/:id/save
export async function togglePostSave ( req, res, next ) {
    let message;
    let savedPost;

    try {
        logger.debug( 'Called togglePostSave()...' );

        const postId = req.params.id;
        const post = await prisma.post.findUnique( {
            where: { id: postId },
            select: { published: true }
        } );
        if ( !post ) {
            message = `Not Found: Post with id ${ postId } not found`;
            logger.error( message );
            return res.status( 404 ).json( {
                success: false,
                message
            } );
        }

        const userId = req.user?.id;
        if ( !userId ) {
            message = 'Unauthorized: User must be logged in to save a post';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        if ( !post.published ) {
            message = 'Forbidden: User can only save a published post';
            logger.error( message );
            return res.status( 403 ).json( {
                success: false,
                message
            } );
        }

        const existingSave = await prisma.postSave.findUnique( {
            where: {
                postId_userId: {
                    postId,
                    userId
                }
            }
        } );

        try {
            savedPost = await prisma.$transaction( async ( tx ) => {
                if ( existingSave ) {
                    await tx.postSave.delete( {
                        where: {
                            postId_userId: {
                                postId,
                                userId
                            }
                        }
                    } );

                    return {
                        action: 'unsaved post',
                    };
                } else {
                    await tx.postSave.create( {
                        data: {
                            postId,
                            userId
                        }
                    } );

                    const saves = await tx.postSave.count( {
                        where: { postId }
                    } );

                    return {
                        action: 'saved post',
                        saves
                    };
                }
            } );

        } catch ( error ) {
            logger.error( 'Error during post saving:', error );
            throw error;
        }

        res.status( 200 ).json( {
            success: true,
            message: `User ${ savedPost.action }`,
            data: {
                postId,
                saved: savedPost.action === 'saved post',
                saveCount: savedPost.saves ?? 0
            }
        } );

    } catch ( error ) {
        logger.error( 'Error calling togglePostSave()...' );

        if ( error.code === 'P2025' ) {
            return res.status( 404 ).json( {
                success: false,
                message: 'Not Found: Post not found',
            } );
        }

        return next( error );
    }
}

// @desc Update post
// @route PATCH /api/post/:id
export async function updatePost ( req, res, next ) {
    let updatedPost;
    let message;

    try {
        logger.debug( 'Called updatePost()...' );

        const userId = req.user?.id;
        if ( !userId ) {
            message = 'Unauthorized: User must be logged in to update posts';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        const postId = req.params.id;
        const post = await prisma.post.findUnique( {
            where: { id: postId },
            select: { authorId: true },
        } );

        if ( !post ) {
            message = 'Not found: Post not found';
            logger.error( message );
            return res.status( 404 ).json( {
                success: false,
                message
            } );
        }

        if ( post.authorId !== userId ) {
            message = 'Forbidden: You do not have permission to update this post';
            logger.error( message );
            return res.status( 403 ).json( {
                success: false,
                message
            } );
        }

        const validatedData = ups.parse( req.body );

        if ( validatedData.title ) {
            const slug = slugify( validatedData.title, {
                lower: true,
                strict: true,
                trim: true
            } );

            const existingPost = await prisma.post.findUnique( {
                where: { slug }
            } );

            if ( existingPost ) {
                message = `Conflict: Post with title ${ existingPost.title } already exists`;
                logger.error( message );
                return res.status( 409 ).json( {
                    success: false,
                    message
                } );
            }
        }

        try {
            updatedPost = await prisma.post.update( {
                where: { id: postId },
                data: validatedData,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    content: true,
                    tags: true,
                    published: true,
                    updatedAt: true,
                    author: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            } );
        } catch ( error ) {
            logger.error( 'Error during post update:', error );
            throw error;
        }

        return res.status( 200 ).json( {
            success: true,
            message: 'Post updated successfully',
            data: {
                updatedPost
            }
        } );

    } catch ( error ) {
        logger.error( 'Error calling updatePost()...' );

        if ( error instanceof z.ZodError ) {
            message = 'Unprocessable Entity: Invalid data';
            logger.error( message );
            return res.status( 422 ).json( {
                success: false,
                message,
                errors: error.errors
            } );
        }

        if ( error.code === 'P2002' ) {
            message = 'Conflict: Post with this title already exists';
            logger.error( message );
            return res.status( 409 ).json( {
                success: false,
                message
            } );
        }

        return next( error );
    }
}

// @desc Update post
// @route DELETE /api/post/:id
export async function deletePost ( req, res, next ) {
    let message;
    let deletedPost;

    try {
        logger.debug( 'Called deletePost()...' );

        const userId = req.user?.id;
        if ( !userId ) {
            message = 'Unauthorized: User must be logged in to delete posts';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        const postId = req.params.id;
        const post = await prisma.post.findUnique( {
            where: { id: postId },
            select: { authorId: true },
        } );

        if ( !post ) {
            message = 'Not found: Post not found';
            logger.error( message );
            return res.status( 404 ).json( {
                success: false,
                message
            } );
        }

        if ( post.authorId !== userId ) {
            message = 'Forbidden: You do not have permission to delete this post';
            logger.error( message );
            return res.status( 403 ).json( {
                success: false,
                message
            } );
        }

        try {
            deletedPost = await prisma.post.delete( {
                where: { id: postId },
            } );
        } catch ( error ) {
            logger.error( 'Error during post update:', error );
            throw error;
        }

        return res.status( 200 ).json( {
            success: true,
            message: 'Post deleted successfully',
            data: {
                deletedPost
            }
        } );
    } catch ( error ) {
        logger.error( 'Error calling deletePost()...', error );

        if ( error.code === 'P2025' ) {
            return res.status( 404 ).json( {
                success: false,
                message: 'Not Found: Post not found',
            } );
        }

        return next( error );
    }
}