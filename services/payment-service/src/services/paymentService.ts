import { prisma } from '@bribooks/database';
import { NotFoundError } from '@bribooks/shared';

export interface PaymentFilters {
    status?: string;
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

export class PaymentService {
    /**
     * Create a payment intent
     * Note: This is a basic implementation. In production, integrate with Stripe/PayPal
     */
    async createPaymentIntent(
        userId: string,
        amount: number,
        currency: string,
        metadata?: any
    ): Promise<any> {
        // Create payment record in database
        const payment = await prisma.payment.create({
            data: {
                userId,
                amount,
                currency,
                status: 'PENDING',
                metadata: metadata || {},
            },
        });

        // TODO: In production, create actual payment intent with Stripe
        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount,
        //     currency,
        //     metadata: { paymentId: payment.id, userId },
        // });

        return {
            ...payment,
            clientSecret: `mock_secret_${payment.id}`, // Mock client secret
        };
    }

    /**
     * Get payment by ID
     */
    async getPaymentById(paymentId: string, userId: string): Promise<any> {
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                    },
                },
            },
        });

        if (!payment) {
            throw new NotFoundError('Payment not found');
        }

        // Verify payment belongs to user
        if (payment.userId !== userId) {
            throw new Error('You do not have permission to view this payment');
        }

        return payment;
    }

    /**
     * Get user's payment history
     */
    async getUserPayments(
        userId: string,
        filters: PaymentFilters = {}
    ): Promise<PaginatedResult<any>> {
        const page = filters.page || 1;
        const limit = Math.min(filters.limit || 20, 100);
        const skip = (page - 1) * limit;

        const where: any = {
            userId,
        };

        if (filters.status) {
            where.status = filters.status;
        }

        const [payments, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.payment.count({ where }),
        ]);

        return {
            items: payments,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Update payment status
     */
    async updatePaymentStatus(paymentId: string, status: string): Promise<any> {
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
        });

        if (!payment) {
            throw new NotFoundError('Payment not found');
        }

        return await prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: status as any,
                updatedAt: new Date(),
            },
        });
    }

    /**
     * Process webhook event
     * Note: In production, verify webhook signature from Stripe
     */
    async processWebhook(event: any): Promise<void> {
        // TODO: Verify webhook signature
        // const signature = req.headers['stripe-signature'];
        // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentSuccess(event.data);
                break;
            case 'payment_intent.payment_failed':
                await this.handlePaymentFailure(event.data);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    }

    /**
     * Handle successful payment
     */
    private async handlePaymentSuccess(data: any): Promise<void> {
        // Update payment status in database
        const paymentId = data.metadata?.paymentId;
        if (paymentId) {
            await this.updatePaymentStatus(paymentId, 'COMPLETED');
        }
    }

    /**
     * Handle failed payment
     */
    private async handlePaymentFailure(data: any): Promise<void> {
        // Update payment status in database
        const paymentId = data.metadata?.paymentId;
        if (paymentId) {
            await this.updatePaymentStatus(paymentId, 'FAILED');
        }
    }

    /**
     * Get payment statistics for user
     */
    async getPaymentStats(userId: string): Promise<any> {
        const [totalPayments, completedPayments, totalAmount] = await Promise.all([
            prisma.payment.count({ where: { userId } }),
            prisma.payment.count({ where: { userId, status: 'COMPLETED' } }),
            prisma.payment.aggregate({
                where: { userId, status: 'COMPLETED' },
                _sum: { amount: true },
            }),
        ]);

        return {
            totalPayments,
            completedPayments,
            pendingPayments: totalPayments - completedPayments,
            totalAmount: totalAmount._sum.amount || 0,
        };
    }
}

export const paymentService = new PaymentService();
