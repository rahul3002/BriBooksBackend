import { Request, Response, NextFunction } from 'express';
import { safetyService } from '../services/safetyService';
import { z } from 'zod';
import { AgeGroup } from '@bribooks/shared';

// Validation schemas
const safetyCheckSchema = z.object({
    body: z.object({
        text: z.string().min(1, 'Text is required'),
        ageGroup: z.nativeEnum(AgeGroup),
    }),
});

const batchCheckSchema = z.object({
    body: z.object({
        items: z.array(
            z.object({
                text: z.string().min(1),
                ageGroup: z.nativeEnum(AgeGroup),
            })
        ).min(1, 'At least one item is required').max(50, 'Maximum 50 items allowed'),
    }),
});

const profanityCheckSchema = z.object({
    body: z.object({
        text: z.string().min(1, 'Text is required'),
    }),
});

export class SafetyController {
    // POST /api/safety/check
    async checkContentSafety(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = safetyCheckSchema.parse({ body: req.body });

            const result = await safetyService.checkContentSafety(
                validated.body.text,
                validated.body.ageGroup
            );

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/safety/batch-check
    async batchCheckContent(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = batchCheckSchema.parse({ body: req.body });

            const results = await safetyService.batchCheckContent(validated.body.items);

            res.json({
                success: true,
                data: results,
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/safety/profanity-check
    async checkProfanity(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = profanityCheckSchema.parse({ body: req.body });

            const result = safetyService.checkProfanityOnly(validated.body.text);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const safetyController = new SafetyController();
