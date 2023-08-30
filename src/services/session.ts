import { NotFoundError } from '../errors';
import User, { IUser } from '../models/User';
import { SessionModel, ISession, IPopulatedSession } from '../models/Session';

class SessionService {
  async createSession(
    start: Date,
    end: Date,
    type: string,
    link: string,
    creator: string
  ) {}
}

export default new SessionService();
