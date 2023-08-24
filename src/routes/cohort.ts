import {
  getAllCohort,
  getCohort,
  updateCohort,
  deleteCohort,
  createCohort,
} from '../controllers/cohort';
import express from 'express';
import restrict from '../middleware/authorizeRole';

const router = express.Router();

router.route('/').get(getAllCohort).post(restrict('admin'), createCohort);
router
  .route('/:cohortId')
  .get(getCohort)
  .patch(restrict('admin'), updateCohort)
  .delete(restrict('admin'), deleteCohort);

export default router;
