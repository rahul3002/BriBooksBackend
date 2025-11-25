import { Request, Response, NextFunction } from 'express';
import { AppError, handleError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorHandler = (
    error: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    // Log error
    logger.error({
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method
    });

    const errorResponse = handleError(error);

    res.status(errorResponse.statusCode).json({
        success: false,
        error: {
            code: errorResponse.code,
            message: errorResponse.message,
            ...(errorResponse.details && { details: errorResponse.details })
        }
    });
};
