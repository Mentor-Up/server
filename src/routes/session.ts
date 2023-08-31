import {
  createSession,
  getAllSession,
  getSession,
  updateSession,
  deleteSession,
  updateStatus,
  getStatus,
  getUpcomingSessions,
} from '../controllers/session';

import { createComment, getAllComment } from '../controllers/comment';
import { createReview, getReview } from '../controllers/review';
import express from 'express';
import restrict from '../middleware/authorizeRole';

const router = express.Router();

router
  .route('/')
  .get(getAllSession)
  .post(restrict('mentor', 'student-leader'), createSession);

router
  .route('/upcoming')
  .get(restrict('mentor', 'student-leader'), getUpcomingSessions);
router
  .route('/:sessionId')
  .get(getSession)
  .patch(restrict('mentor', 'student-leader'), updateSession);
router
  .route('/:cohortId/:sessionId')
  .delete(restrict('mentor', 'student-leader'), deleteSession);
router
  .route('/:sessionId/student/updateStatus')
  .patch(restrict('student', 'student-leader'), updateStatus);
router
  .route('/:sessionId/student/status')
  .get(restrict('student', 'student-leader'), getStatus);

router.route('/comment').get(getAllComment).post(createComment);
router.route('/review').post(createReview);
router
  .route('/:sessionId/review')
  .get(restrict('mentor', 'student-leader'), getReview);

export default router;
