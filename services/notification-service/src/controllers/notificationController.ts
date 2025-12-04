import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notificationService';
import { z } from 'zod';

// Validation schemas
const getNotificationsSchema = z.object({
    query: z.object({
        read: z.enum(['true', 'false']).optional(),
        type: z.enum(['EMAIL', 'IN_APP', 'PUSH']).optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});

const createNotificationSchema = z.object({
    body: z.object({
        type: z.enum(['EMAIL', 'IN_APP', 'PUSH']),
        title: z.string().min(1, 'Title is required'),
        message: z.string().min(1, 'Message is required'),
        metadata: z.any().optional(),
    }),
});

export class NotificationController {
    // GET /api/notifications
    async getNotifications(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const validated = getNotificationsSchema.parse({ query: req.query });

            const filters = {
                read: validated.query.read === 'true' ? true : validated.query.read === 'false' ? false : undefined,
                type: validated.query.type as 'EMAIL' | 'IN_APP' | 'PUSH' | undefined,
                page: validated.query.page ? parseInt(validated.query.page) : undefined,
                limit: validated.query.limit ? parseInt(validated.query.limit) : undefined,
            };

            const result = await notificationService.getUserNotifications(req.user.userId, filters);

            res.json({
                success: true,
                data: result.items,
                meta: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/notifications/unread-count
    async getUnreadCount(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const count = await notificationService.getUnreadCount(req.user.userId);

            res.json({
                success: true,
                data: { count },
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/notifications/:id/read
    async markAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const notification = await notificationService.markAsRead(
                req.params.id,
                req.user.userId
            );

            res.json({
                success: true,
                data: notification,
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/notifications/read-all
    async markAllAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const result = await notificationService.markAllAsRead(req.user.userId);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/notifications/:id
    async deleteNotification(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            await notificationService.deleteNotification(req.params.id, req.user.userId);

            res.json({
                success: true,
                message: 'Notification deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/notifications
    async createNotification(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const validated = createNotificationSchema.parse({ body: req.body });

            const notification = await notificationService.createNotification(
                req.user.userId,
                validated.body.type,
                validated.body.title,
                validated.body.message,
                validated.body.metadata
            );

            res.status(201).json({
                success: true,
                data: notification,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const notificationController = new NotificationController();
