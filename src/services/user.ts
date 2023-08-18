import User, { IUser } from '../models/User';

interface IUserProfile {
  name: string;
  email: string;
  role: string[];
}

class UserService {
  async getUserById(userId: string): Promise<IUserProfile | null> {
    const user = await User.findById(userId);

    if (!user) return null;

    const userProfile = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return userProfile;
  }
}

export default new UserService();
