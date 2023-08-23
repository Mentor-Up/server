import { Request, Response, NextFunction } from 'express';
import { UnauthenticatedError } from '../errors';

const restrict = (...role: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.user.role;
    if (!userRoles.some((r) => role.includes(r))) {
      throw new UnauthenticatedError(
        'Your roles are not allowed to access this route'
      );
    }
    console.log('userRoles', userRoles);
    next();
  };
};

export default restrict;
