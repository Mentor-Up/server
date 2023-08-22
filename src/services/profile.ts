import { NotFoundError } from '../errors';
import User, { IUser } from '../models/User';
import { IUserProfile } from '../models/User';

class ProfileService {
  async getUser(userId: string): Promise<IUserProfile | null> {
    const user = await User.findById(userId).populate('cohorts', '_id name');
    if (!user) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    return user.generateProfile();
  }

  async updateUser(
    userId: string,
    update: Partial<IUser>
  ): Promise<IUserProfile | null> {
    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    }).populate('cohorts', '_id name');
    if (!updatedUser) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
    return updatedUser.generateProfile();
  }

  // TODO: if user profile is deleted, all user's references in cohorts, sessions should be deleted
  // TODO: Review the approach to set isDeleted flag and filter out deleted users from responses
  async deleteUser(userId: string): Promise<void> {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundError(`User with id ${userId} not found`);
    }
  }
}

export default new ProfileService();
