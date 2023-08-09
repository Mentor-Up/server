import {
  getAllWeek,
  getWeek,
  updateWeek,
  deleteWeek,
  createWeek,
} from '../controllers/week';
import express from 'express';

const router = express.Router();

router.route('/').get(getAllWeek).post(createWeek);
router.route('/:weekId').get(getWeek).patch(updateWeek).delete(deleteWeek);

export default router;
