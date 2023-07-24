import cors from 'cors';
import 'express-async-errors';
import express from 'express';
const app = express();
import favicon from 'express-favicon';
import logger from 'morgan';
import session from 'express-session';
import { node_env } from './config';
import compression from 'compression'
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import errorHandlerMiddleware from './middleware/error-handler';
import notFoundMiddleware from './middleware/not-found'
import authMiddleware from "./middleware/authentication";

import authRouter from "./routes/auth";

app.use(
    rateLimiter({
      windowMs: 15 * 60 * 1000,
      max: 60,
    })
);
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (node_env === 'development') {
  app.use(logger('dev'));
} else {
  app.use(
      logger(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms',
      { stream: { write: (message) => console.log('info', message.trim(), { tags: ['http'] }) } }
    )
  );
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/testAuth", authMiddleware, (req, res) => res.send("OK!"));
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

export default app;
