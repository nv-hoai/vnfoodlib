import { Request } from 'express';
import type { IUser } from '../../../features/users/models/Users.js';

declare global {
  namespace Express {
    // Override the default User type to use our IUser
    type User = IUser;

    interface Request {
      user?: User;
    }
  }
}

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
  user?: IUser;
}
