import { Request, Response, NextFunction } from 'express';
import { httpResponse } from '@controllers/http/httpResponse';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  let response: Response;
  switch (error.name) {
    case 'NotFoundError':
      response = httpResponse.notFound(res);
      break;
    case 'InvalidParameterError':
      response = httpResponse.badRequest(res);
      break;
    case 'ForbiddenError':
      response = httpResponse.forbidden(res);
      break;
    default:
      response = httpResponse.internalServerError(res);
      break;
  }
  const message = response.statusCode === 500 ? 'Internal server error' : error.message;
  response.send({ error: message });
  console.error(error.stack);
}
