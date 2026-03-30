import express, { Router } from 'express';
import {
  createCollection,
  getUserCollections,
  getCollectionById,
  getPublicCollections,
  updateCollection,
  deleteCollection,
  addDishToCollection,
  removeDishFromCollection,
  searchCollections
} from '../controllers/collectionsController.js';
import { protect } from '../../auth/middleware/authMiddleware.js';

const router: Router = express.Router();

// Public routes (no auth required)
router.get('/public', getPublicCollections);
router.get('/:id', getCollectionById);

// Protect routes below
router.use(protect);

// Create collection
router.post('/', createCollection);

// Get user collections
router.get('/', getUserCollections);

// Search collections
router.get('/search', searchCollections);

// Update collection
router.patch('/:id', updateCollection);

// Delete collection
router.delete('/:id', deleteCollection);

// Add dish to collection
router.post('/dish/add', addDishToCollection);

// Remove dish from collection
router.post('/dish/remove', removeDishFromCollection);

export default router;
