import {
  activateAccount,
  login,
  logout,
  refreshToken,
  register,
} from '../controllers/auth';
import express from 'express';
import authMiddleware from '../middleware/authentication';
import createHash from '../utils/hashPassword';

const router = express.Router();

router.post('/register', authMiddleware, register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/refreshToken', refreshToken);
router.get('/confirmation', activateAccount);

export default router;
