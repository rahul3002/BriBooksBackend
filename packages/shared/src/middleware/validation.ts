import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

// Generic validation middleware
export const validate = (schema: ZodSchema) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                next(new ValidationError('Validation failed', formattedErrors));
            } else {
                next(error);
            }
        }
    };
};

// Common validation schemas
export const commonSchemas = {
    // Pagination
    pagination: z.object({
        query: z.object({
            page: z.string().optional().transform(val => parseInt(val || '1')),
            limit: z.string().optional().transform(val => parseInt(val || '10'))
        })
    }),

    // ID parameter
    idParam: z.object({
        params: z.object({
            id: z.string().uuid('Invalid ID format')
        })
    }),

    // Email
    email: z.string().email('Invalid email address'),

    // Password (min 8 chars, at least one uppercase, one lowercase, one number)
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),

    // Username
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must not exceed 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
};
