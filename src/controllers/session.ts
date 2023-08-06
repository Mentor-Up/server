import User from '../models/User';
import Cohort from '../models/Cohort';
import Session from '../models/Session';
import Week from '../models/Week';
import { Request, Response } from 'express';
import { BadRequestError, UnauthenticatedError ,   UnauthorizedError} from '../errors';


const createSession = async (req: Request, res: Response) => {
  if (req.user.role !== "mentor" && req.user.role !== "student-leader") {
    throw new UnauthorizedError(
        'Your current role does not allow you to add new session'
      );
  }  
  const { start, end, type, link, weekId, cohortId } = req.body;
  if (!start || !end || !type || !link) {
    throw new BadRequestError('Missing values');
  }

  const session = await Session.create({ start, end, type, link, creator: req.user.userId });
  const week = await Week.findOneAndUpdate(
    { _id: weekId },
    { $push: { sessions: session.id } }
  );

  return res.status(201).json({session });
};


const getAllSession = async (req: Request, res: Response) => {
  const sessions = await Session.find({});

  if (!sessions) {
    return res
      .status(200)
      .json({ status: "Success", message: "There are no sessions" });
  }

  res.status(200).json({ status: "Success", sessions });
};


const getSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const populateOptions = {
    path: "participant.user.userInfo",
    select: "_id name " 
  }
  const session = await Session.findOne({ _id: sessionId }).populate(populateOptions)

  if (!session) {
    throw new BadRequestError("This session does not exist");
  }
  res.status(200).json({ status: "Success", session });
};

const updateSession = async (req: Request, res: Response) => {

    const {body: { start, end, type, link, userStatus}} = req
    const { sessionId } = req.params;

    if ( start === '' || end === '' || type === '' || link === '') {
      throw new BadRequestError('Name or Start or End or Type or Link fields cannot be empty')
    }

    if (req.user.role === "student" || req.user.role === "student-leader") {
        
          const sessionUser = await Session.findOneAndUpdate(
            { _id: sessionId,
            "participant.user.userInfo": req.user.userId
             },
            { $set: 
                { "participant.$.user.userStatus":  userStatus } 
            }, 
            {new: true}
          );
          if (!sessionUser) {
            const newSessionUser = await Session.findOneAndUpdate(
                { _id: sessionId,
                },
                {
                    $addToSet: {
                        participant: {
                            user: {
                                userInfo: req.user.userId,
                                userStatus: userStatus
                            }
                        }
                    }
                }, 
                {new: true}
            )
            if(!newSessionUser){
                throw new BadRequestError("Can not update this session");
            }
            return res.status(201).json({newSessionUser});

          }
          return res.status(201).json({sessionUser});

    } else if (req.user.role === "mentor" || req.user.role === "student-leader") {
        if (req.user.role !== "mentor" && req.user.role !== "student-leader") {
            throw new UnauthorizedError(
                'Your current role does not allow you to update session'
              );
          }  

      const session = await Session.findByIdAndUpdate(
        { _id: sessionId },
        req.body,
        { new: true, runValidators: true }
      )
      if (!session) {
        throw new BadRequestError("This session does not exist");
      }

      return res.status(201).json({session});
    } else {
        throw new UnauthorizedError(
            'Your current role does not allow you to perform this action'
          );
    }

};

const deleteSession = async (req: Request, res: Response) => {

  const { sessionId } = req.params;

  const session = await Session.findByIdAndRemove({ _id: sessionId });

  if (!session) {
    throw new BadRequestError("This session does not exist");
  }

  res.status(200).json({ status: 'Success! session removed.' });
};

export { createSession, getAllSession, getSession, updateSession, deleteSession  };
