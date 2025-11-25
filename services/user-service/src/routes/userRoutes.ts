import express from 'express';
import { userController } from '../controllers/userController';
import { authenticate } from '@bribooks/shared';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/profile', userController.getProfile.bind(userController));
router.put('/profile', userController.updateProfile.bind(userController));
router.get('/books', userController.getMyBooks.bind(userController));
router.get('/stats', userController.getStats.bind(userController));

export default router;
