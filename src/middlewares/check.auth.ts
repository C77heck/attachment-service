import express from 'express';
import { NextFunction } from 'express/ts4.0';
import { ERROR_MESSAGES } from '../libs/constants';

const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req: any, res: express.Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = (req as any).headers.authorization.split(' ')[1];

    if (!token) {
      throw new Error(ERROR_MESSAGES.FAILED_AUTH);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();

  } catch (err) {
    return next(new HttpError(
      ERROR_MESSAGES.FAILED_AUTH,
      401
    ));
  }
};
