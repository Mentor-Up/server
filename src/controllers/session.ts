import User from '../models/User';
import Cohort from '../models/Cohort';
import { SessionModel, ISession, IPopulatedSession } from '../models/Session';
import { Week } from '../models/Week';
import { Request, Response } from 'express';
import { BadRequestError } from '../errors';
import scheduleEvent from '../utils/createGoogleSchedule';

const createSession = async (req: Request, res: Response) => {
  const { start, end, type, link, cohortId, numberSessions } = req.body;
  const userId = req.user.userId;

  if (!start || !end || !type || !link) {
    throw new BadRequestError('Missing values');
  }

  const cohort = await Cohort.findById(cohortId);
  if (!cohort) {
    throw new BadRequestError('Cohort not found');
  }

  if (!numberSessions) {
    const session = await SessionModel.create({
      start,
      end,
      type,
      link,
      creator: userId,
    });

    const startDate = new Date(start);
    const week = cohort?.weeks.find(
      (w) => w.start < startDate && w.end > startDate
    );

    week?.sessions.push(session._id);
    await cohort?.save();

    return res.status(201).json({ session });
  } else {
    for (let i = 0; i < numberSessions; i++) {
      const weekInMil = 7 * 24 * 60 * 60 * 1000;
      let startTimestamp = new Date(start).getTime() + i * weekInMil;
      let endTimestamp = new Date(end).getTime() + i * weekInMil;
      const session = await SessionModel.create({
        start: new Date(startTimestamp),
        end: new Date(endTimestamp),
        type,
        link,
        creator: userId,
      });

      const week = cohort?.weeks.find(
        (w) => w.start < session?.start && w.end > session?.start
      );

      week?.sessions.push(session._id);
      await cohort?.save();
      return res.status(201).json({ cohort });
    }
  }
};

const getAllSession = async (req: Request, res: Response) => {
  const sessions = await SessionModel.find({});

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
    path: 'participant',
    select: '_id name ',
  };
  const populateCreatorOptions = {
    path: 'creator',
    select: '_id name ',
  };
  const populateDiscussionOptions = {
    path: 'discussion',
    select: '_id name content ',
    populate: {
      path: 'name',
      select: 'name',
    },
  };

  const session = await SessionModel.findById({ _id: sessionId })
    .populate(populateParticipantOptions)
    .populate(populateCreatorOptions)
    .populate(populateDiscussionOptions);

  if (!session) {
    throw new BadRequestError('This session does not exist');
  }
  res.status(200).json({ status: 'Success', session });
};

const updateSession = async (req: Request, res: Response) => {
  const {
    body: { start, end, type, link },
  } = req;

  const { sessionId } = req.params;

  if (start === '' || end === '' || type === '' || link === '') {
    throw new BadRequestError(
      'Name or Start or End or Type or Link fields cannot be empty'
    );
  }

  const session = await SessionModel.findOneAndUpdate(
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

  const session = await SessionModel.findByIdAndRemove({
    _id: sessionId,
    creator: req.user.userId,
  });

  if (!session) {
    throw new BadRequestError('This session does not exist');
  }

  res.status(200).json({ status: 'Success! Session removed.' });
};

const updateStatus = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.user.userId;
  const { status } = req.body;

  const session = await SessionModel.findById({ _id: sessionId });

  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  const user = await User.findById({ _id: userId });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const participantIds = session.participant.map((participant) =>
    (participant as any)._id.toString()
  );

  let event;
  if (status === true) {
    if (!participantIds.includes(userId)) {
      (session.participant as any).push(user._id);
      await session.save();

      const populateCreatorOptions = {
        path: 'creator',
        select: 'name ',
      };

      const sessionInfo = (await SessionModel.findById({
        _id: sessionId,
      }).populate(populateCreatorOptions)) as IPopulatedSession;

      const sessionStart = sessionInfo?.start;
      const sessionEnd = sessionInfo?.end;
      const sessionType = sessionInfo?.type;
      const sessionCreator = sessionInfo?.creator.name;

      if (!sessionType || !sessionEnd || !sessionStart) {
        throw new BadRequestError('Session does not exist');
      }

      event = await scheduleEvent({
        summary: sessionType,
        start: sessionStart,
        end: sessionEnd,
        email: req.user.email,
        description: sessionCreator,
      });
    }
  } else if (status === false) {
    const userIndex = session.participant.findIndex((participant) =>
      (participant as any).equals(userId)
    );
    if (userIndex !== -1) {
      session.participant.splice(userIndex, 1);
      await session.save();
    }
  } else {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  return res.status(200).json({ session, event });
};

const getStatus = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const populateParticipantOptions = {
    path: 'participant',
    select: '_id name ',
  };
  const session = await SessionModel.findById({ _id: sessionId }).populate(
    populateParticipantOptions
  );
  if (!session) {
    throw new BadRequestError('This session does not exist');
  }
  const participantWithUserStatus = session?.participant.find((p) => {
    console.log(p);

    const userId = (p as any)._id.toString();
    return userId === req.user.userId;
  });
  if (!participantWithUserStatus) {
    throw new BadRequestError('You are not joining this session');
  }
  res.status(200).json(true);
};

const getUpcomingSessions = async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const sessions = await SessionModel.find({
    creator: userId,
    start: { $gte: Date.now() },
  })
    .limit(6)
    .sort({ start: 'asc' });

  res.status(200).json({ sessions });
};

export {
  createSession,
  getAllSession,
  getSession,
  updateSession,
  deleteSession,
  updateStatus,
  getStatus,
  getUpcomingSessions,
};
