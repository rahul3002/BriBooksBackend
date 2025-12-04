import { prisma } from '@bribooks/database';
import { NotFoundError } from '@bribooks/shared';
import { emailService } from './emailService';

export interface NotificationFilters {
    read?: boolean;
    type?: 'EMAIL' | 'IN_APP' | 'PUSH';
    page?: number;
    limit?: number;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class NotificationService {
    /**
     * Create a new notification
     */
    async createNotification(
        userId: string,
        type: 'EMAIL' | 'IN_APP' | 'PUSH',
        title: string,
        message: string,
        metadata?: any
    ): Promise<any> {
        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                metadata: metadata || {},
                read: false,
            },
        });

        // If it's an email notification, send the email
        if (type === 'EMAIL') {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { email: true, firstName: true },
            });

            if (user) {
                await emailService.sendEmail({
                    to: user.email,
                    subject: title,
                    body: message,
                });
            }
        }

        return notification;
    }

    /**
     * Get user's notifications with pagination
     */
    async getUserNotifications(
        userId: string,
        filters: NotificationFilters = {}
    ): Promise<PaginatedResult<any>> {
        const page = filters.page || 1;
        const limit = Math.min(filters.limit || 20, 100); // Max 100 per page
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {
            userId,
        };

        if (filters.read !== undefined) {
            where.read = filters.read;
        }

        if (filters.type) {
            where.type = filters.type;
        }

        // Get notifications and total count
        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.notification.count({ where }),
        ]);

        return {
            items: notifications,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get unread notification count for user
     */
    async getUnreadCount(userId: string): Promise<number> {
        return await prisma.notification.count({
            where: {
                userId,
                read: false,
            },
        });
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId: string, userId: string): Promise<any> {
        // Verify notification belongs to user
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        });

        if (!notification) {
            throw new NotFoundError('Notification not found');
        }

        if (notification.userId !== userId) {
            throw new Error('You do not have permission to update this notification');
        }

        return await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
    }

    /**
     * Mark all notifications as read for user
     */
    async markAllAsRead(userId: string): Promise<{ count: number }> {
        const result = await prisma.notification.updateMany({
            where: {
                userId,
                read: false,
            },
            data: {
                read: true,
            },
        });

        return { count: result.count };
    }

    /**
     * Delete notification
     */
    async deleteNotification(notificationId: string, userId: string): Promise<void> {
        // Verify notification belongs to user
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        });

        if (!notification) {
            throw new NotFoundError('Notification not found');
        }

        if (notification.userId !== userId) {
            throw new Error('You do not have permission to delete this notification');
        }

        await prisma.notification.delete({
            where: { id: notificationId },
        });
    }

    /**
     * Send welcome notification to new user
     */
    async sendWelcomeNotification(userId: string, firstName: string, email: string): Promise<void> {
        await this.createNotification(
            userId,
            'IN_APP',
            'Welcome to BriBooks!',
            `Hi ${firstName}, welcome to BriBooks! Start creating your first children's book today.`
        );

        await emailService.sendWelcomeEmail(email, firstName);
    }

    /**
     * Send book published notification
     */
    async sendBookPublishedNotification(
        userId: string,
        bookTitle: string,
        email: string,
        firstName: string
    ): Promise<void> {
        await this.createNotification(
            userId,
            'IN_APP',
            'Book Published!',
            `Congratulations! Your book "${bookTitle}" has been published successfully.`,
            { bookTitle }
        );

        await emailService.sendBookPublishedEmail(email, firstName, bookTitle);
    }
}

export const notificationService = new NotificationService();
