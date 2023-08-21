import express from 'express';
import authMiddleware from '../middleware/authentication';
import { getUsers } from '../controllers/user';

const router = express.Router();

router.get('/', authMiddleware, getUsers);

export default router;
