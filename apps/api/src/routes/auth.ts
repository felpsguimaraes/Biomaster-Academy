import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../lib/auth.js';

const roleMap = {
  student: 'STUDENT',
  teacher: 'TEACHER',
  admin: 'ADMIN'
} as const;

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['student', 'teacher', 'admin']).default('student')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Dados inválidos.', errors: parsed.error.flatten() });
  }

  const { name, email, password, role } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: 'Usuário já cadastrado.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: roleMap[role]
    }
  });

  return res.status(201).json({
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role.toLowerCase()
    },
    token: signToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role.toLowerCase() as 'student' | 'teacher' | 'admin'
    })
  });
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Credenciais inválidas.' });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
  }

  return res.json({
    token: signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase() as 'student' | 'teacher' | 'admin'
    }),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase()
    }
  });
});
