import express from 'express';
import { publishingController } from '../controllers/publishingController';

const router = express.Router();

// All routes are public (no authentication required)

router.get('/books', publishingController.getBooks.bind(publishingController));
router.get('/books/:id', publishingController.getBookById.bind(publishingController));
router.get('/search', publishingController.searchBooks.bind(publishingController));
router.get('/popular', publishingController.getPopularBooks.bind(publishingController));
router.get('/recent', publishingController.getRecentBooks.bind(publishingController));
router.get('/age-group/:ageGroup', publishingController.getBooksByAgeGroup.bind(publishingController));

export default router;
