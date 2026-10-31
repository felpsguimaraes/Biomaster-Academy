import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../lib/auth.js';
import type { User } from '../types.js';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, 'id' | 'email' | 'name' | 'role'>;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token ausente ou inválido.' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = verifyToken(token);

    req.user = {
      id: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: String(payload.role) as User['role']
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Sessão inválida.' });
  }
}
