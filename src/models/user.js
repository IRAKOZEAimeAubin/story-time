import { z } from 'zod';

export const UpdateUserSchema = z.object( {
    name: z
        .string()
        .min( 2, {
            message: "Name must be at least 2 characters long",
        } )
        .optional(),
    email: z
        .string()
        .email( "Email must be a valid email" )
        .optional(),
    password: z
        .string()
        .min( 8, { message: "Password must be at least 8 characters long" } )
        .refine(
            ( value ) =>
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]*$/.test(
                    value ?? "",
                ),
            "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
        )
        .optional()
} );
