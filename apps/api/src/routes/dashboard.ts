import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

export const dashboardRouter = Router();

dashboardRouter.get('/', authMiddleware, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Usuário não autenticado.' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  const subjects = await prisma.subject.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  const stats = [
    { label: 'Disciplinas', value: String(subjects.length || 4) },
    { label: 'Aulas concluídas', value: '86%' },
    { label: 'Quiz recente', value: '92%' },
    { label: 'Meta semanal', value: 'Em dia' }
  ];

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      role: user.role.toLowerCase()
    },
    stats,
    subjects: subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      description: subject.description ?? 'Sem descrição',
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)],
      progress: 72
    })),
    tasks: [
      { id: 'task-1', title: 'Resumo de Álgebra', due: 'Hoje, 18:00', status: 'pending' },
      { id: 'task-2', title: 'Quiz de Física', due: 'Amanhã, 09:30', status: 'pending' },
      { id: 'task-3', title: 'Leitura de capítulo', due: 'Qua, 14:00', status: 'done' }
    ],
    recentAssessments: [
      { title: 'Prova de Programação', score: '92%', date: '12/10' },
      { title: 'Atividade de Álgebra', score: '88%', date: '08/10' },
      { title: 'Quiz de Cálculo', score: '76%', date: '05/10' }
    ]
  });
});
