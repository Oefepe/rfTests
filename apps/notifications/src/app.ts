import express, { Application, Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import notificationRouter from './features/notifications/notifications.routes';

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((req: Request, res: Response, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

app.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({ hello: 'world' });
});

// use routes
app.use('/notifications/', notificationRouter);
app.use('/api/notifications/', notificationRouter);

app.use(errorHandler);

export default app;
