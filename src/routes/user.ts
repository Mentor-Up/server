import express from 'express';
import authMiddleware from '../middleware/authentication';
import { getUsers, getUser } from '../controllers/user';

const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.get('/:userId', authMiddleware, getUser);

export default router;
