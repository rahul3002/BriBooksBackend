import express from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticate } from '@bribooks/shared';

const router = express.Router();

// Webhook endpoint (public, no authentication)
router.post('/webhook', paymentController.handleWebhook.bind(paymentController));

// All other routes require authentication
router.use(authenticate);

router.post('/intent', paymentController.createPaymentIntent.bind(paymentController));
router.get('/stats', paymentController.getPaymentStats.bind(paymentController));
router.get('/:id', paymentController.getPaymentById.bind(paymentController));
router.get('/', paymentController.getUserPayments.bind(paymentController));

export default router;
