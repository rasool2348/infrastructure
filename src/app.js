import logger from '#config/logger.js';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from '#routes/auth.routes.js';
import usersRouter from '#routes/users.routs.js';
import { securityMiddleware } from '#middleware/security.middleware.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  morgan('combined', {
    stream: {
      write: message => {
        logger.info(message.trim());
      },
    },
  })
);

app.use(securityMiddleware);

app.get('/', (req, res) => {
  logger.info('Hello from Infrastructure API ... ');
  res.status(200).send('Hello from Infrastructure API ... ');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

app.use('/api/auth', router);
app.use('/api/users', usersRouter);
export default app;
