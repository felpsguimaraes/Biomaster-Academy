import jwt, { JwtPayload } from 'jsonwebtoken';
import type { User } from '../types.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'biomaster-academy-dev-secret';

export function signToken(user: Pick<User, 'id' | 'email' | 'role' | 'name'>) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
