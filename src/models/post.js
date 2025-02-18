import { z } from 'zod';

export const PostSchema = z.object( {
    title: z
        .string( {
            required_error: "Title is required",
        } )
        .min( 5, {
            message: "Title must be at least 5 characters long",
        } )
        .max( 100, {
            message: "Title must be at most 100 characters long",
        } ),
    tags: z
        .array( z.string(), {
            required_error: "Tags are required",
        } )
        .min( 1, {
            message: "At least one tag is required",
        } )
        .max( 5, {
            message: "You can add at most 5 tags",
        } ),
    content: z
        .string( {
            required_error: "Content is required",
        } )
        .min( 10, {
            message: "Content must be at least 10 characters long",
        } ),
} );