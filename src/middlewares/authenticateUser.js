import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

export async function authenticateUser ( req, res, next ) {
    try {
        const authHeader = req.headers.authorization;
        if ( !authHeader?.startsWith( 'Bearer ' ) ) {
            return res.status( 401 ).json( {
                success: false,
                message: 'Authentication required'
            } );
        }

        const token = authHeader.split( ' ' )[ 1 ];
        const decoded = jwt.verify( token, process.env.JWT_SECRET );

        const user = await prisma.user.findUnique( {
            where: { id: decoded.userId },
            select: { id: true }
        } );

        if ( !user ) {
            return res.status( 401 ).json( {
                success: false,
                message: 'Invalid token'
            } );
        }

        req.user = { id: user.id };
        next();
    } catch ( error ) {
        if ( error instanceof jwt.JsonWebTokenError ) {
            return res.status( 401 ).json( {
                success: false,
                message: 'Invalid token'
            } );
        }

        if ( error instanceof jwt.TokenExpiredError ) {
            return res.status( 401 ).json( {
                success: false,
                message: 'Token expired'
            } );
        }

        next( error );
    }
}
