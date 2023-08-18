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

  async updateUser(
    userId: string,
    updatedData: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      const user = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
      });

      return user;
    } catch (error) {
      throw new Error('An error occurred while updating the user');
    }
  }
}

export default new UserService();
