import { logger } from "../helpers/logger.js";
import prisma from "../prisma.js";

// @desc Fetch the user profile of the authenticated user
// @route GET /api/user
export async function fetchUserProfile ( req, res, next ) {
    let user;
    let message;

    try {
        logger.debug( 'Called fetchUserProfile()...' );

        const userId = req.user?.id;
        if ( !userId ) {
            message = 'Unauthorized: User must be logged in to fetch profile';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        try {
            user = await prisma.user.findUnique( {
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    _count: {
                        select: {
                            likedPosts: true,
                            dislikedPosts: true,
                            savedPosts: true
                        }
                    }
                }
            } );
        } catch ( error ) {
            logger.error( 'Error during profile fetching:', error );
            throw error;
        }

        return res.status( 200 ).json( {
            success: true,
            message: 'User profile fetched successfully',
            data: {
                user
            }
        } );

    } catch ( error ) {
        logger.error( 'Error calling fetchUserProfile()...' );

        if ( error.code === 'P2025' ) {
            return res.status( 404 ).json( {
                success: false,
                message: 'Not Found: User not found',
            } );
        }

        return next( error );
    }
}

// @desc Fetch posts liked by the authenticated user
// @route GET /api/user/posts/liked
export async function fetchLikedPosts ( req, res, next ) {
    let message;
    let likedPosts;

    try {
        logger.debug( 'Called fetchLikedPosts()...' );

        const userId = req.user?.id;
        if ( !userId ) {
            message = 'Unauthorized: User must be logged in to fetch user liked posts';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        try {
            likedPosts = await prisma.postLike.findMany( {
                where: { userId },
                select: {
                    post: {
                        select: {
                            id: true,
                            title: true,
                            content: true,
                            slug: true,
                            tags: true,
                            published: true,
                            author: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            createdAt: true,
                            updatedAt: true,
                        }
                    }
                }
            } );
        } catch ( error ) {
            logger.error( 'Error during liked posts fetching:', error );
            throw error;
        }

        return res.status( 200 ).json( {
            success: true,
            message: 'Liked posts fetched successfully',
            data: { likedPosts },
        } );

    } catch ( error ) {
        logger.error( 'Error calling fetchLikedPosts()...' );
        return next( error );
    }
}

// @desc Fetch posts disliked by the authenticated user
// @route GET /api/user/posts/disliked
export async function fetchDislikedPosts ( req, res, next ) {
    let message;
    let dislikedPosts;

    try {
        logger.debug( 'Called fetchDislikedPosts()...' );

        const userId = req.user?.id;
        if ( !userId ) {
            message = 'Unauthorized: User must be logged in to fetch user disliked posts';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        try {
            dislikedPosts = await prisma.postDislike.findMany( {
                where: { userId },
                select: {
                    post: {
                        select: {
                            id: true,
                            title: true,
                            content: true,
                            slug: true,
                            tags: true,
                            published: true,
                            author: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            createdAt: true,
                            updatedAt: true,
                        }
                    }
                }
            } );
        } catch ( error ) {
            logger.error( 'Error during disliked posts fetching:', error );
            throw error;
        }

        return res.status( 200 ).json( {
            success: true,
            message: 'Disliked posts fetched successfully',
            data: { dislikedPosts },
        } );

    } catch ( error ) {
        logger.error( 'Error calling fetchDislikedPosts()...' );
        return next( error );
    }
}

// @desc Fetch posts saved by the authenticated user
// @route GET /api/user/posts/saved
export async function fetchSavedPosts ( req, res, next ) {
    let message;
    let savedPosts;

    try {
        logger.debug( 'Called fetchSavedPosts()...' );

        const userId = req.user?.id;
        if ( !userId ) {
            message = 'Unauthorized: User must be logged in to fetch user saved posts';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        try {
            savedPosts = await prisma.postSave.findMany( {
                where: { userId },
                select: {
                    post: {
                        select: {
                            id: true,
                            title: true,
                            content: true,
                            slug: true,
                            tags: true,
                            published: true,
                            author: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            createdAt: true,
                            updatedAt: true,
                        }
                    }
                }
            } );
        } catch ( error ) {
            logger.error( 'Error during saved posts fetching:', error );
            throw error;
        }

        return res.status( 200 ).json( {
            success: true,
            message: 'Saved posts fetched successfully',
            data: { savedPosts },
        } );

    } catch ( error ) {
        logger.error( 'Error calling fetchSavedPosts()...' );
        return next( error );
    }
}
