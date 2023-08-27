import User from '../models/User';
import Cohort from '../models/Cohort';
import { Week } from '../models/Week';
import { SessionModel, ISession } from '../models/Session';
import Comment from '../models/Comment';
import Review from '../models/Review';
import { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../errors';
import { read } from 'fs';

const createReview = async (req: Request, res: Response) => {
  const { sessionId, content } = req.body;
  if (!content) {
    throw new BadRequestError('Missing values');
  }

  const review = await Review.create({
    sessionId,
    content,
  });

  const session = await SessionModel.findOneAndUpdate(
    { _id: sessionId },
    { $push: { review: review._id } }
  );

  return res.status(201).json({ session });
};

const getReview = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const populateReviewOptions = {
    path: 'review',
    select: '_id content',
  };
  const session = await SessionModel.findById({ _id: sessionId })
    .populate({
      path: 'creator',
      select: 'name _id',
    })
    .populate(populateReviewOptions);

  const creatorId = session?.creator._id.toString();
  if (req.user.userId !== creatorId) {
    throw new UnauthorizedError('You are not authorized to view the reviews');
  }
  res.status(200).json(session);
};

export { createReview, getReview };
