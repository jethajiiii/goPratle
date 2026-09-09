import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import env from './config/env.js';
import requirementRoutes from './routes/requirementRoutes.js';
import errorHandler from './middleware/errorHandler.js';

await connectDB();

const app = express();

app.use(
  cors({
    origin: env.frontendOrigin,
    methods: ['GET', 'POST'],
  })
);

app.use(express.json());

app.use('/api/requirements', requirementRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`🚀 Server running on http://localhost:${env.port} [${env.nodeEnv}]`);
});
