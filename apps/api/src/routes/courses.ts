import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { courses } from '../data/store.js';

export const coursesRouter = Router();

coursesRouter.get('/', authMiddleware, (_req, res) => {
  return res.json({ courses });
});

coursesRouter.get('/:id', authMiddleware, (req, res) => {
  const course = courses.find((item) => item.id === req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Curso não encontrado.' });
  }

  return res.json(course);
});
