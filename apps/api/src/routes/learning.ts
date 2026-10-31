import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { agenda, materials, reports } from '../data/store.js';

export const learningRouter = Router();

learningRouter.use(authMiddleware);

learningRouter.get('/materials', (_req, res) => {
  return res.json({ materials });
});

learningRouter.get('/agenda', (_req, res) => {
  return res.json({ agenda });
});

learningRouter.get('/reports', (_req, res) => {
  return res.json({ reports });
});

learningRouter.get('/overview', (_req, res) => {
  return res.json({
    summary: {
      materialsCount: materials.length,
      agendaCount: agenda.length,
      averageProgress: 78,
      focusArea: 'Matemática Aplicada'
    }
  });
});
