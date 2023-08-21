// authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user && user.role.includes('admin')) {
    console.log('isAdmin roles: ', user.role);
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};
