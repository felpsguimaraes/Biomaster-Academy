import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/login', (_req, res) => {
  res.json({
    message: 'Login em desenvolvimento',
    token: 'demo-token'
  });
});

authRouter.post('/register', (_req, res) => {
  res.json({
    message: 'Cadastro em desenvolvimento',
    status: 'pending'
  });
});
