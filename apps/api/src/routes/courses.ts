import { Router } from 'express';

export const coursesRouter = Router();

coursesRouter.get('/', (_req, res) => {
  res.json({
    courses: [
      {
        id: 1,
        name: 'Matemática Aplicada',
        professor: 'Prof. Rafael Costa',
        students: 42,
        status: 'ativo'
      },
      {
        id: 2,
        name: 'Programação Web',
        professor: 'Prof. Ana Oliveira',
        students: 38,
        status: 'ativo'
      }
    ]
  });
});

coursesRouter.get('/:id', (req, res) => {
  res.json({
    id: req.params.id,
    name: 'Curso de exemplo',
    professor: 'Professor responsável',
    students: 25,
    status: 'ativo'
  });
});
