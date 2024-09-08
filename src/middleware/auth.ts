import { Request, Response, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import UserService from '@src/services/UserService';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['user-id'];

  if (!userId || typeof userId !== 'string') {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized: User ID is required' });
  }

  try {
    const user = await UserService.getOneById(parseInt(userId, 10));
    if (!user) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized: User not found' });
    }

    // Attach the user to the request object for use in subsequent middleware or route handlers
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
};

export default authMiddleware;
