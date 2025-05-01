import express, { Application, Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import coachingRouter from './features/coaching/routes';
import { netLogs } from './services/log/backendLogger';

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

netLogs(app);

app.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({ hello: 'world' });
});

// use routes
app.use('/coaching/', coachingRouter);
app.use('/api/coaching/', coachingRouter);

app.use(errorHandler);

export default app;
