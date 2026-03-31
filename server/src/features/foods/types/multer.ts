import { Request } from 'express';
import { File } from 'multer';

declare global {
  namespace Express {
    interface User {
      _id: any;
      email: string;
      name: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
  user?: Express.User;
}
