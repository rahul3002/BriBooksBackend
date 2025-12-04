import express from 'express';
import { adminController } from '../controllers/adminController';
import { authenticate } from '@bribooks/shared';
import { requireAdmin } from '../middleware/adminAuth';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// User Management
router.get('/users', adminController.getUsers.bind(adminController));
router.put('/users/:id/role', adminController.updateUserRole.bind(adminController));
router.put('/users/:id/suspend', adminController.suspendUser.bind(adminController));
router.put('/users/:id/activate', adminController.activateUser.bind(adminController));

// Content Moderation
router.get('/books/pending', adminController.getPendingBooks.bind(adminController));
router.put('/books/:id/approve', adminController.approveBook.bind(adminController));
router.put('/books/:id/reject', adminController.rejectBook.bind(adminController));

// Analytics
router.get('/analytics/users', adminController.getUserAnalytics.bind(adminController));
router.get('/analytics/books', adminController.getBookAnalytics.bind(adminController));
router.get('/analytics/overview', adminController.getSystemOverview.bind(adminController));

// System Monitoring
router.get('/system/database', adminController.getDatabaseStats.bind(adminController));

export default router;
