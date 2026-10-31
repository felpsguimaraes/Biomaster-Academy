export const users = [
  {
    id: 'u-1001',
    name: 'João da Silva',
    email: 'joao@biomaster.com',
    password: '123456',
    role: 'student'
  },
  {
    id: 'u-1002',
    name: 'Prof. Ana Oliveira',
    email: 'ana@biomaster.com',
    password: '123456',
    role: 'teacher'
  },
  {
    id: 'u-1003',
    name: 'Maria Admin',
    email: 'admin@biomaster.com',
    password: '123456',
    role: 'admin'
  }
] as const;

export const courses = [
  {
    id: 'course-1',
    name: 'Matemática Aplicada',
    professor: 'Prof. Ana Oliveira',
    students: 42,
    status: 'active'
  },
  {
    id: 'course-2',
    name: 'Programação Web',
    professor: 'Prof. Bruno Costa',
    students: 36,
    status: 'active'
  },
  {
    id: 'course-3',
    name: 'Física',
    professor: 'Prof. Camila Duarte',
    students: 29,
    status: 'paused'
  }
] as const;

export const subjects = [
  { id: 'sub-1', name: 'Álgebra Linear', description: 'Matrizes e vetores', color: '#3b82f6', progress: 72 },
  { id: 'sub-2', name: 'Cálculo I', description: 'Limites e derivadas', color: '#10b981', progress: 58 },
  { id: 'sub-3', name: 'Estruturas Web', description: 'HTML, CSS e JS', color: '#f59e0b', progress: 89 },
  { id: 'sub-4', name: 'Física Básica', description: 'Movimento e energia', color: '#ef4444', progress: 64 }
] as const;

export const tasks = [
  { id: 'task-1', title: 'Resumo de Álgebra', due: 'Hoje, 18:00', status: 'pending' },
  { id: 'task-2', title: 'Quiz de Física', due: 'Amanhã, 09:30', status: 'pending' },
  { id: 'task-3', title: 'Leitura de capítulo', due: 'Qua, 14:00', status: 'done' }
] as const;

export const recentAssessments = [
  { title: 'Prova de Programação', score: '92%', date: '12/10' },
  { title: 'Atividade de Álgebra', score: '88%', date: '08/10' },
  { title: 'Quiz de Cálculo', score: '76%', date: '05/10' }
] as const;
