import express from 'express';
import { getCohorts } from '../controllers/user';

const router = express.Router();

router.get('/cohorts', getCohorts);

export default router;
