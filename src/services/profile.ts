import { NotFoundError } from '../errors';
import User, { IUser } from '../models/User';
import { IUserProfile } from '../models/User';

class ProfileService {
  async getUser(userId: string): Promise<IUserProfile> {
    const user = await User.findById(userId).populate('cohorts', '_id name');
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    return user.generateProfile();
  }

  async updateUser(userId: string, update: Partial<IUser>): Promise<IUser> {
    const user = await User.findById(userId).populate('cohorts', '_id name');
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    user.set(update); // runs validations
    const updatedUser = await user.save();

    return updatedUser;
  }

  // TODO: if user profile is deleted, all user's references in cohorts, sessions should be deleted
  async deleteUser(userId: string): Promise<void> {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
  }
}

export default new ProfileService();
