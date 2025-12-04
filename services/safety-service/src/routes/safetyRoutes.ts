import express from 'express';
import { safetyController } from '../controllers/safetyController';
import { authenticate } from '@bribooks/shared';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/check', safetyController.checkContentSafety.bind(safetyController));
router.post('/batch-check', safetyController.batchCheckContent.bind(safetyController));
router.post('/profanity-check', safetyController.checkProfanity.bind(safetyController));

export default router;
