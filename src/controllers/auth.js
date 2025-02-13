import prisma from "../prisma.js";
import { RegistrationSchema as rs, LoginSchema as ls } from "../models/auth.js";
import { logger } from "../helpers/logger.js";
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// @desc User registration
// @route POST /api/auth/register
export async function register ( req, res, next ) {
    let user;
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
                success: false,
                message
            } );
        }

        const hashedPassword = await bcrypt.hash( validatedData.password, 12 );

        try {
            user = await prisma.$transaction( async ( tx ) => {
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

// @desc User registration
// @route POST /api/auth/login
export async function login ( req, res, next ) {
    try {
        logger.debug( 'Called login()...' );

        const validatedData = ls.parse( req.body );

        const existingUser = await prisma.user.findUnique( {
            where: { email: validatedData.email },
            include: { auth: true }
        } );

        if ( !existingUser || !existingUser.auth ) {
            return res.status( 401 ).json( {
                success: false,
                message: 'Invalid credentials'
            } );
        }

        const isPasswordValid = await bcrypt.compare( validatedData.password, existingUser.auth.hashedPassword );

        if ( !isPasswordValid ) {
            return res.status( 401 ).json( {
                success: false,
                message: 'Invalid credentials'
            } );
        }

        const token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status( 200 ).json( {
            success: true,
            message: 'User successfully logged in',
            data: {
                user: {
                    id: existingUser.id,
                    email: existingUser.email,
                    name: existingUser.name
                },
                token
            }
        } );

    } catch ( error ) {
        logger.error( 'Error calling login()...' );

        if ( error instanceof z.ZodError ) {
            return res.status( 422 ).json( {
                success: false,
                message: 'Validation failed',
                errors: error.errors
            } );
        }

        return next( error );
    }
}
