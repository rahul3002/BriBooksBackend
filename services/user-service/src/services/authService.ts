import bcrypt from 'bcryptjs';
import { prisma } from '@bribooks/database';
import { generateToken, AuthTokenPayload } from '@bribooks/shared';
import {
    AuthenticationError,
    ConflictError,
    NotFoundError,
} from '@bribooks/shared';

export class AuthService {
    // Register new user
    async register(data: {
        email: string;
        username: string;
        password: string;
        firstName: string;
        lastName: string;
    }) {
        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email: data.email }, { username: data.username }],
            },
        });

        if (existingUser) {
            if (existingUser.email === data.email) {
                throw new ConflictError('Email already registered');
            }
            throw new ConflictError('Username already taken');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(data.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });

        // Generate token
        const tokenPayload: AuthTokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role as any,
        };
        const token = generateToken(tokenPayload);

        return { user, token };
    }

    // Login user
    async login(email: string, password: string) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AuthenticationError('Invalid credentials');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            throw new AuthenticationError('Invalid credentials');
        }

        // Generate token
        const tokenPayload: AuthTokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role as any,
        };
        const token = generateToken(tokenPayload);

        // Return user without password
        const { passwordHash, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    }

    // Verify email
    async verifyEmail(userId: string) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { emailVerified: true },
            select: {
                id: true,
                email: true,
                emailVerified: true,
            },
        });

        return user;
    }

    // Change password
    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundError('User');
        }

        // Verify old password
        const isValidPassword = await bcrypt.compare(oldPassword, user.passwordHash);

        if (!isValidPassword) {
            throw new AuthenticationError('Current password is incorrect');
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });

        return { message: 'Password updated successfully' };
    }
}

export const authService = new AuthService();
