import express from 'express';
import authMiddleware from '../middleware/authentication';
import { getUsers, getUser, updateUser } from '../controllers/user';
import restrict from '../middleware/authorizeRole';

const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.get('/:userId', authMiddleware, getUser);
router.patch('/:userId', authMiddleware, restrict('admin'), updateUser);

export default router;
