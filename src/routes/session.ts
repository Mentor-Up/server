import { createSession, getAllSession, getSession, updateSession, deleteSession  } from '../controllers/session';
import express from 'express';

const router = express.Router();

router.route("/").get(getAllSession).post(createSession);
router
  .route("/:sessionId")
  .get(getSession)
  .patch(updateSession)
  .delete(deleteSession);


export default router;