import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/paymentService';
import { z } from 'zod';

// Validation schemas
const createPaymentSchema = z.object({
    body: z.object({
        amount: z.number().positive('Amount must be positive'),
        currency: z.string().min(3).max(3).toUpperCase(),
        metadata: z.any().optional(),
    }),
});

const getPaymentsSchema = z.object({
    query: z.object({
        status: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});

export class PaymentController {
    // POST /api/payments/intent
    async createPaymentIntent(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const validated = createPaymentSchema.parse({ body: req.body });

            const payment = await paymentService.createPaymentIntent(
                req.user.userId,
                validated.body.amount,
                validated.body.currency,
                validated.body.metadata
            );

            res.status(201).json({
                success: true,
                data: payment,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/payments/:id
    async getPaymentById(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const payment = await paymentService.getPaymentById(req.params.id, req.user.userId);

            res.json({
                success: true,
                data: payment,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/payments
    async getUserPayments(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const validated = getPaymentsSchema.parse({ query: req.query });

            const filters = {
                status: validated.query.status,
                page: validated.query.page ? parseInt(validated.query.page) : undefined,
                limit: validated.query.limit ? parseInt(validated.query.limit) : undefined,
            };

            const result = await paymentService.getUserPayments(req.user.userId, filters);

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

    // GET /api/payments/stats
    async getPaymentStats(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not authenticated');

            const stats = await paymentService.getPaymentStats(req.user.userId);

            res.json({
                success: true,
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/payments/webhook
    async handleWebhook(req: Request, res: Response, next: NextFunction) {
        try {
            // Process webhook event
            await paymentService.processWebhook(req.body);

            res.json({
                success: true,
                message: 'Webhook processed successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

export const paymentController = new PaymentController();
