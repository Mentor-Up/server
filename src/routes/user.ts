import express from 'express';
import authMiddleware from '../middleware/authentication';
// import controllers
import getProfile from '../controllers/user';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);

export default router;
