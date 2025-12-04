import express from 'express';
import { notificationController } from '../controllers/notificationController';
import { authenticate } from '@bribooks/shared';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', notificationController.getNotifications.bind(notificationController));
router.get('/unread-count', notificationController.getUnreadCount.bind(notificationController));
router.put('/:id/read', notificationController.markAsRead.bind(notificationController));
router.put('/read-all', notificationController.markAllAsRead.bind(notificationController));
router.delete('/:id', notificationController.deleteNotification.bind(notificationController));
router.post('/', notificationController.createNotification.bind(notificationController));

export default router;
