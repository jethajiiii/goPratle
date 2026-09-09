import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import requirementRoutes from './routes/requirementRoutes.js';
import errorHandler from './middleware/errorHandler.js';

await connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  })
);

app.use(express.json());

app.use('/api/requirements', requirementRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
