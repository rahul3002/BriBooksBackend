import { prisma } from '@bribooks/database';
import { NotFoundError } from '@bribooks/shared';

export class UserService {
    // Get user profile
    async getUserProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                avatarUrl: true,
                bio: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotFoundError('User');
        }

        return user;
    }

    // Update user profile
    async updateUserProfile(
        userId: string,
        data: {
            firstName?: string;
            lastName?: string;
            bio?: string;
            avatarUrl?: string;
        }
    ) {
        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                avatarUrl: true,
                bio: true,
                updatedAt: true,
            },
        });

        return user;
    }

    // Get user's books
    async getUserBooks(userId: string) {
        const books = await prisma.book.findMany({
            where: { authorId: userId },
            include: {
                _count: {
                    select: { chapters: true, reviews: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        return books;
    }

    // Get user statistics
    async getUserStats(userId: string) {
        const [totalBooks, publishedBooks, totalViews] = await Promise.all([
            prisma.book.count({
                where: { authorId: userId },
            }),
            prisma.book.count({
                where: { authorId: userId, status: 'PUBLISHED' },
            }),
            prisma.book.aggregate({
                where: { authorId: userId },
                _sum: { viewCount: true },
            }),
        ]);

        return {
            totalBooks,
            publishedBooks,
            totalViews: totalViews._sum.viewCount || 0,
        };
    }
}

export const userService = new UserService();
