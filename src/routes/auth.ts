import { login, logout, refreshToken, register } from '../controllers/auth';
import express from 'express';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/refreshToken', refreshToken);

export default router;
