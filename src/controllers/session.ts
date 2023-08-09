import User from '../models/User';
import Cohort from '../models/Cohort';
import Session from '../models/Session';
import Week from '../models/Week';
import { Request, Response } from 'express';
import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from '../errors';

const createSession = async (req: Request, res: Response) => {
  const { start, end, type, link, weekId } = req.body;
  if (!start || !end || !type || !link) {
    throw new BadRequestError('Missing values');
  }

  const session = await Session.create({
    start,
    end,
    type,
    link,
    creator: req.user.userId,
  });
  const week = await Week.findOneAndUpdate(
    { _id: weekId },
    { $push: { sessions: session.id } }
  );

  return res.status(201).json({ session });
};

const getAllSession = async (req: Request, res: Response) => {
  const sessions = await Session.find({});

  if (!sessions) {
    return res
      .status(200)
      .json({ status: 'Success', message: 'There are no sessions' });
  }

  res.status(200).json({ status: 'Success', sessions });
};

const getSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const populateParticipantOptions = {
    path: 'participant.user.userInfo',
    select: '_id name ',
  };
  const populateCreatorOptions = {
    path: 'creator',
    select: '_id name ',
  };
  const populateDiscussionOptions = {
    path: 'discussion',
    select: '_id name content ',
  };

  const session = await Session.findOne({ _id: sessionId })
    .populate(populateParticipantOptions)
    .populate(populateCreatorOptions)
    .populate(populateDiscussionOptions);

  if (!session) {
    throw new BadRequestError('This session does not exist');
  }
  res.status(200).json({ status: 'Success', session });
};

const updateSession = async (req: Request, res: Response) => {
  const { start, end, type, link } = req.body;
  const { sessionId } = req.params;

  if (start === '' || end === '' || type === '' || link === '') {
    throw new BadRequestError(
      'Name or Start or End or Type or Link fields cannot be empty'
    );
  }

  const session = await Session.findOneAndUpdate(
    { _id: sessionId, creator: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!session) {
    throw new BadRequestError('This session does not exist');
  }

  return res.status(201).json({ session });
};

const deleteSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const session = await Session.findByIdAndRemove({
    _id: sessionId,
    creator: req.user.userId,
  });

  if (!session) {
    throw new BadRequestError('This session does not exist');
  }

  res.status(200).json({ status: 'Success! Session removed.' });
};

const updateStatus = async (req: Request, res: Response) => {
  const { userStatus } = req.body;
  const { sessionId } = req.params;

  const sessionUser = await Session.findOneAndUpdate(
    { _id: sessionId, 'participant.user.userInfo': req.user.userId },
    { $set: { 'participant.$.user.userStatus': userStatus } },
    { new: true }
  );
  if (!sessionUser) {
    const newSessionUser = await Session.findOneAndUpdate(
      { _id: sessionId },
      {
        $addToSet: {
          participant: {
            user: {
              userInfo: req.user.userId,
              userStatus,
            },
          },
        },
      },
      { new: true }
    );
    if (!newSessionUser) {
      throw new BadRequestError('Can not update this session');
    }
    return res.status(201).json({ newSessionUser });
  }
  return res.status(201).json({ sessionUser });
};

export {
  createSession,
  getAllSession,
  getSession,
  updateSession,
  deleteSession,
  updateStatus,
};
