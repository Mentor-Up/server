import express from 'express';
import authMiddleware from '../middleware/authentication';
import { isAdmin } from '../middleware/isAdmin';
import { getUsers, getUser, updateUser } from '../controllers/user';

const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.get('/:userId', authMiddleware, getUser);
router.patch('/:userId', authMiddleware, isAdmin, updateUser);

export default router;
