// Custom Error Classes

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public code: string = 'INTERNAL_ERROR',
        public isOperational: boolean = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: any) {
        super(400, message, 'VALIDATION_ERROR');
        this.details = details;
    }
    details?: any;
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication failed') {
        super(401, message, 'AUTHENTICATION_ERROR');
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Insufficient permissions') {
        super(403, message, 'AUTHORIZATION_ERROR');
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(404, `${resource} not found`, 'NOT_FOUND');
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(409, message, 'CONFLICT');
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = 'Too many requests') {
        super(429, message, 'RATE_LIMIT_EXCEEDED');
    }
}

export class ExternalServiceError extends AppError {
    constructor(service: string, message?: string) {
        super(
            502,
            message || `External service ${service} is unavailable`,
            'EXTERNAL_SERVICE_ERROR'
        );
    }
}

// Error handler utility
export const handleError = (error: Error | AppError) => {
    if (error instanceof AppError) {
        return {
            statusCode: error.statusCode,
            code: error.code,
            message: error.message,
            ...(error instanceof ValidationError && { details: error.details })
        };
    }

    // Unknown error
    return {
        statusCode: 500,
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : error.message
    };
};
