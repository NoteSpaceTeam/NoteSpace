import { NextFunction, Request, Response } from 'express';
import { ControllersLogger } from '@src/utils/logging';

const logger = ControllersLogger('ws');

export default async function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  logger.logInfo(`Request: ${req.method} ${req.url}`);
  next();
}
