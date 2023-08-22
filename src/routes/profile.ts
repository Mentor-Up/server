import express from 'express';
import authMiddleware from '../middleware/authentication';
import {
  getProfile,
  updateProfile,
  deleteProfile,
} from '../controllers/profile';

const router = express.Router();

router.get('/', authMiddleware, getProfile);
router.patch('/', authMiddleware, updateProfile);
router.delete('/', authMiddleware, deleteProfile);

export default router;
