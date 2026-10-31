import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { courses, subjects, tasks, recentAssessments } from '../data/store.js';

export const dashboardRouter = Router();

dashboardRouter.get('/', authMiddleware, (req, res) => {
  const userName = req.user?.name ?? 'Usuário';

  return res.json({
    user: {
      id: req.user?.id ?? 'guest',
      name: userName,
      role: req.user?.role ?? 'student'
    },
    stats: [
      { label: 'Disciplinas', value: '12' },
      { label: 'Aulas concluídas', value: '86%' },
      { label: 'Quiz recente', value: '92%' },
      { label: 'Meta semanal', value: 'Em dia' }
    ],
    subjects,
    tasks,
    recentAssessments
  });
});
