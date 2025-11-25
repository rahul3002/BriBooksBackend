import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload, UserRole } from '../types';
import { AuthenticationError, AuthorizationError } from '../utils/errors';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: AuthTokenPayload;
        }
    }
}

// JWT Authentication Middleware
export const authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('No token provided');
        }

        const token = authHeader.substring(7);
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error('JWT_SECRET not configured');
        }

        const decoded = jwt.verify(token, jwtSecret) as AuthTokenPayload;
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new AuthenticationError('Invalid token'));
        } else if (error instanceof jwt.TokenExpiredError) {
            next(new AuthenticationError('Token expired'));
        } else {
            next(error);
        }
    }
};

// Role-based Authorization Middleware
export const authorize = (...allowedRoles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AuthenticationError('User not authenticated'));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new AuthorizationError(
                    `Access denied. Required roles: ${allowedRoles.join(', ')}`
                )
            );
        }

        next();
    };
};

// Generate JWT Token
export const generateToken = (payload: AuthTokenPayload): string => {
    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!jwtSecret) {
        throw new Error('JWT_SECRET not configured');
    }

    return jwt.sign(payload, jwtSecret, { expiresIn } as any);
};

// Verify JWT Token
export const verifyToken = (token: string): AuthTokenPayload => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT_SECRET not configured');
    }

    return jwt.verify(token, jwtSecret) as AuthTokenPayload;
};
