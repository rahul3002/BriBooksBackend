import { Request, Response, NextFunction } from 'express';
import { publishingService } from '../services/publishingService';
import { z } from 'zod';
import { AgeGroup } from '@bribooks/shared';

// Validation schemas
const getBooksSchema = z.object({
    query: z.object({
        ageGroup: z.nativeEnum(AgeGroup).optional(),
        tags: z.string().optional(),
        search: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});

const searchBooksSchema = z.object({
    query: z.object({
        q: z.string().min(1, 'Search query is required'),
        ageGroup: z.nativeEnum(AgeGroup).optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});

const popularBooksSchema = z.object({
    query: z.object({
        limit: z.string().optional(),
    }),
});

const ageGroupBooksSchema = z.object({
    params: z.object({
        ageGroup: z.nativeEnum(AgeGroup),
    }),
    query: z.object({
        limit: z.string().optional(),
    }),
});

export class PublishingController {
    // GET /api/publishing/books
    async getBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = getBooksSchema.parse({ query: req.query });

            const filters = {
                ageGroup: validated.query.ageGroup,
                tags: validated.query.tags ? validated.query.tags.split(',') : undefined,
                search: validated.query.search,
                page: validated.query.page ? parseInt(validated.query.page) : undefined,
                limit: validated.query.limit ? parseInt(validated.query.limit) : undefined,
            };

            const result = await publishingService.getPublishedBooks(filters);

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

    // GET /api/publishing/books/:id
    async getBookById(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await publishingService.getBookById(req.params.id, true);

            res.json({
                success: true,
                data: book,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/publishing/search
    async searchBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = searchBooksSchema.parse({ query: req.query });

            const filters = {
                ageGroup: validated.query.ageGroup,
                page: validated.query.page ? parseInt(validated.query.page) : undefined,
                limit: validated.query.limit ? parseInt(validated.query.limit) : undefined,
            };

            const result = await publishingService.searchBooks(validated.query.q, filters);

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

    // GET /api/publishing/popular
    async getPopularBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = popularBooksSchema.parse({ query: req.query });
            const limit = validated.query.limit ? parseInt(validated.query.limit) : 10;

            const books = await publishingService.getPopularBooks(limit);

            res.json({
                success: true,
                data: books,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/publishing/recent
    async getRecentBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const books = await publishingService.getRecentBooks(limit);

            res.json({
                success: true,
                data: books,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/publishing/age-group/:ageGroup
    async getBooksByAgeGroup(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = ageGroupBooksSchema.parse({
                params: req.params,
                query: req.query,
            });

            const limit = validated.query.limit ? parseInt(validated.query.limit) : 10;
            const books = await publishingService.getBooksByAgeGroup(
                validated.params.ageGroup,
                limit
            );

            res.json({
                success: true,
                data: books,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const publishingController = new PublishingController();
