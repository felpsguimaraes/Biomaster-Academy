import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { subjects } from '../data/store.js';

export const subjectsRouter = Router();

subjectsRouter.get('/', authMiddleware, (_req, res) => {
  return res.json({ subjects });
});
