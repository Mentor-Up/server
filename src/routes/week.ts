import {
  getAllWeek,
  getWeek,
  updateWeek,
  deleteWeek,
  createWeek,
} from '../controllers/week';
import express from 'express';
import { restrict } from '../controllers/auth';

const router = express.Router();

router.route('/').get(getAllWeek).post(restrict('admin'), createWeek);
router
  .route('/:weekId')
  .get(getWeek)
  .patch(restrict('admin'), updateWeek)
  .delete(restrict('admin'), deleteWeek);

export default router;
