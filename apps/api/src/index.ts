import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health.js';
import { authRouter } from './routes/auth.js';
import { coursesRouter } from './routes/courses.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(helmet());
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);

app.listen(port, () => {
  console.log(`Biomaster API running on http://localhost:${port}`);
});
