import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

interface TokenPayload extends JwtPayload {
  userId: string;
  version?: number;
}

interface User {
  _id: string | any; // MongoDB ObjectId
  tokenVersion: number;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const generateAccessToken = (userId: string): string => {
  const options: SignOptions = { expiresIn: '15m' };
  return jwt.sign(
    { userId }, 
    process.env.JWT_ACCESS_SECRET as string, 
    options
  );
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as TokenPayload;
};

export const generateRefreshToken = (userId: string, version: number): string => {
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign(
    { userId, version }, 
    process.env.JWT_REFRESH_SECRET as string, 
    options
  );
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as TokenPayload;
};

export const generateTokenPair = (user: User): TokenPair => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id, user.tokenVersion);
  return { accessToken, refreshToken };
};