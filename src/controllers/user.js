import { logger } from "../helpers/logger.js";
import prisma from "../prisma.js";

// @desc Get User Profile
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
