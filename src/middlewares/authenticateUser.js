import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { logger } from '../helpers/logger.js';

export async function authenticateUser ( req, res, next ) {
    let message;

    try {
        const authHeader = req.headers.authorization;
        if ( !authHeader?.startsWith( 'Bearer ' ) ) {
            message = 'Authentication required';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        const token = authHeader.split( ' ' )[ 1 ];
        const decoded = jwt.verify( token, process.env.JWT_SECRET );

        const user = await prisma.user.findUnique( {
            where: { id: decoded.userId },
            select: { id: true }
        } );

        if ( !user ) {
            message = 'Invalid token';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        req.user = { id: user.id };
        next();
    } catch ( error ) {
        if ( error instanceof jwt.JsonWebTokenError ) {
            message = 'Invalid token';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        if ( error instanceof jwt.TokenExpiredError ) {
            message = 'Token expired';
            logger.error( message );
            return res.status( 401 ).json( {
                success: false,
                message
            } );
        }

        next( error );
    }
}
