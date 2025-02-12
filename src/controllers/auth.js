import prisma from "../prisma.js";
import { RegistrationSchema as rs } from "../models/auth.js";
import { logger } from "../helpers/logger.js";
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// @desc User registration
// @route POST /api/sign-up
export async function register ( req, res, next ) {
    try {
        logger.debug( `Called register()...` );

        const validatedData = rs.parse( req.body );

        const existingUser = await prisma.user.findUnique( {
            where: { email: validatedData.email }
        } );

        if ( existingUser ) {
            const message = `User with email ${ existingUser.email } already exists`;
            logger.error( message );
            return res.status( 409 ).json( {
                succes: false,
                message
            } );
        }

        const hashedPassword = await bcrypt.hash( validatedData.password, 12 );

        try {
            const user = await prisma.$transaction( async ( tx ) => {
                const newUser = await tx.user.create( {
                    data: {
                        email: validatedData.email,
                        name: validatedData.name
                    }
                } );

                await tx.auth.create( {
                    data: {
                        hashedPassword,
                        userId: newUser.id
                    }
                } );

                return newUser;
            } );
        } catch ( error ) {
            logger.error( 'Error during Prisma transaction:', error );
            throw error;
        }

        return res.status( 201 ).json( {
            success: true,
            message: 'User created successfully',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            }
        } );

    } catch ( error ) {
        logger.error( 'Error calling register()...' );

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
                message: 'User with this email already exists'
            } );
        }

        return next( error );
    }
};
