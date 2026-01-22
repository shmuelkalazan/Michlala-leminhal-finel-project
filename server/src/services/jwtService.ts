import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  role: 'user' | 'trainer' | 'admin';
}

export const generateToken = (userId: string, role: 'user' | 'trainer' | 'admin'): string => {
  const payload = { userId, role };
  const options = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, options as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
