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

// Protect routes below
router.use(protect);

// Get user collections (must be before :id route)
router.get('/', getUserCollections);

// Search collections (must be before :id route)
router.get('/search', searchCollections);

// Create collection
router.post('/', createCollection);

// Update collection
router.patch('/:id', updateCollection);

// Delete collection
router.delete('/:id', deleteCollection);

// Add dish to collection
router.post('/:id/add-dish', addDishToCollection);

// Remove dish from collection
router.post('/:id/remove-dish', removeDishFromCollection);

// Get collection by ID (must be last because of param)
router.get('/:id', getCollectionById);

export default router;
