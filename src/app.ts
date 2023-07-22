import { Request, Response, NextFunction } from "express";

import cors from 'cors';
import express from 'express';
const app = express();
import favicon from 'express-favicon';
import logger from 'morgan';
import session from 'express-session';
import errorHandlerMiddleware from './middleware/error-handler';
import notFoundMiddleware from './middleware/not-found'


// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

// routes
// app.use('/api/v1',);

export default app;