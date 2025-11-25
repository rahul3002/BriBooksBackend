import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';
import { z } from 'zod';

const updateProfileSchema = z.object({
    body: z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        bio: z.string().max(500).optional(),
        avatarUrl: z.string().url().optional(),
    }),
});

export class UserController {
    // GET /users/profile
    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            const user = await userService.getUserProfile(req.user.userId);

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /users/profile
    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            const validated = updateProfileSchema.parse({ body: req.body });
            const user = await userService.updateUserProfile(
                req.user.userId,
                validated.body
            );

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /users/books
    async getMyBooks(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            const books = await userService.getUserBooks(req.user.userId);

            res.json({
                success: true,
                data: books,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /users/stats
    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            const stats = await userService.getUserStats(req.user.userId);

            res.json({
                success: true,
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController();
