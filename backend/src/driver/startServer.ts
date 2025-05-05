import express, { Application, Request, Response } from 'express';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import config from '../config/config';
import { addRoutes } from '../routes/v1/routes';
import { errorLogs, netLogs } from '../services/log';
import { invalidJsonHandler, notExistHandler } from '../middleware/validation';
import Routes from './Routes';

const app: Application = express();

app.use(
  session({
    secret: config.auth.secretKey,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
invalidJsonHandler(app);

netLogs(app);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('RF Server is Running!');
});

app.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({ hello: 'world' });
});

addRoutes(app);

const newRoute = new Routes(app);
newRoute.setRoutes();

errorLogs(app);

notExistHandler(app);

export default app;
