import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500;
  switch (error.name) {
    case 'NotFoundError':
      statusCode = 404;
      break;
    case 'InvalidParameterError':
      statusCode = 400;
      break;
    case 'ForbiddenError':
      statusCode = 403;
      break;
  }
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  res.status(statusCode).send({ error: message });
  console.error(error.stack);
}
