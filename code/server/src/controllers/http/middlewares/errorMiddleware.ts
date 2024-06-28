import { Request, Response, NextFunction } from 'express';
import { httpResponse } from '@controllers/http/utils/httpResponse';
import { ErrorLogger } from '@src/utils/logging';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
  let response: Response;
  switch (error.name) {
    case 'InvalidParameterError':
      response = httpResponse.badRequest(res);
      break;
    case 'UnauthorizedError':
      response = httpResponse.unauthorized(res);
      break;
    case 'ForbiddenError':
      response = httpResponse.forbidden(res);
      break;
    case 'NotFoundError':
      response = httpResponse.notFound(res);
      break;
    case 'ConflictError':
      response = httpResponse.conflict(res);
      break;
    default:
      response = httpResponse.internalServerError(res);
      break;
  }
  const message = response.statusCode === 500 ? 'Internal server error' : error.message;
  response.send({ error: message });
  ErrorLogger.logError(error.message);
}
