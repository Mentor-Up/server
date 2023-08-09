import cors from 'cors';
import 'express-async-errors';
import express from 'express';
const app = express();
import favicon from 'express-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import compression from 'compression';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import errorHandlerMiddleware from './middleware/error-handler';
import notFoundMiddleware from './middleware/not-found';
import authMiddleware from './middleware/authentication';
import googleOauthHandler from './controllers/OAuth';
import authRouter from './routes/auth';
import cohortRouter from './routes/cohort';
import sessionRouter from './routes/session';
import weekRouter from './routes/week';

import { NODE_ENV } from './config';
import { restrict } from './controllers/auth';
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (NODE_ENV === 'development') {
  app.use(logger('dev'));
} else {
  app.use(
    logger(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms',
      {
        stream: {
          write: (message) =>
            console.log('info', message.trim(), { tags: ['http'] }),
        },
      }
    )
  );
}
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

// routes
app.use('/api/v1/auth', authRouter);
app.use('/testAuth', authMiddleware, (req, res) => res.send('OK!'));
app.use('/api/v1/cohort', authMiddleware, restrict('admin'), cohortRouter);
app.use('/api/v1/week', authMiddleware, weekRouter);
app.use('/api/v1/session', authMiddleware, sessionRouter);

//OAuth
app.get('/auth/google/callback', googleOauthHandler);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
