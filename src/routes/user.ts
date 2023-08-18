import express from 'express';
import authMiddleware from '../middleware/authentication';
// import controllers
import { getProfile, updateProfile } from '../controllers/user';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

export default router;
