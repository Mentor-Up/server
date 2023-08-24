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

router.route('/').post(restrict('admin'), createWeek);
router.route('/:cohortId').get(getAllWeek);
router.route('/:cohortId/current').get(currentWeek);
router
  .route('/:cohortId/:weekId')
  .get(getWeek)
  .patch(restrict('admin'), updateWeek)
  .delete(restrict('admin'), deleteWeek);

export default router;
