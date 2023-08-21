import express from 'express';
import authMiddleware from '../middleware/authentication';
import { getUsers, getUser, updateUser } from '../controllers/user';

const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.get('/:userId', authMiddleware, getUser);
router.patch('/:userId', authMiddleware, updateUser);

export default router;
