import User, { IUser } from '../models/User';
import { IUserProfile } from '../models/User';

class UserService {
  async getUsers(): Promise<IUserProfile[]> {
    const users = await User.find().populate('cohorts', '_id name');

    return users.map((user) => user.generateProfile());
  }
}

export default new UserService();
