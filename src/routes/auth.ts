import { login, logout, refreshToken, register } from '../controllers/auth';
import express from 'express';
import authMiddleware from '../middleware/authentication';

const router = express.Router();

router.post('/register', authMiddleware, register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/refreshToken', refreshToken);

export default router;
