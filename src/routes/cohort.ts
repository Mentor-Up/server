import {
  getAllCohort,
  getCohort,
  updateCohort,
  deleteCohort,
  createCohort,
} from '../controllers/cohort';
import express from 'express';

const router = express.Router();

router.route('/').get(getAllCohort).post(createCohort);
router
  .route('/:cohortId')
  .get(getCohort)
  .patch(updateCohort)
  .delete(deleteCohort);

export default router;
