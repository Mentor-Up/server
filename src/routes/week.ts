import {
  getAllWeek,
  getWeek,
  updateWeek,
  deleteWeek,
  createWeek,
  currentWeek,
} from '../controllers/week';
import express from 'express';
import restrict from '../middleware/authorizeRole';

const router = express.Router();

router.route('/').get(getAllWeek).post(restrict('admin'), createWeek);
router
  .route('/:weekId')
  .get(getWeek)
  .patch(restrict('admin'), updateWeek)
  .delete(restrict('admin'), deleteWeek);
router.route('/current').post(currentWeek);

export default router;
