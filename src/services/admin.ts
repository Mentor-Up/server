import User, { IUser } from '../models/User';
import { IUserProfile } from '../models/User';
import { NotFoundError } from '../errors';

class AdminService {
  async findAllUsers(): Promise<IUserProfile[]> {
    const users = await User.find().populate('cohorts', '_id name');

    return users.map((user) => user.generateProfile());
  }

  async findUserById(userId: string): Promise<IUserProfile | null> {
    const user = await User.findById(userId).populate('cohorts', '_id name');
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    return user.generateProfile();
  }
  // add/remove users to/from cohort
  // add/remove roles to/from user
}

export default new AdminService();
