import { Response } from 'express';

export const httpResponse = {
  ok: (res: Response) => res.status(200),
  created: (res: Response) => res.status(201),
  noContent: (res: Response) => res.status(204).send(),

  // Error responses
  badRequest: (res: Response) => res.status(400),
  unauthorized: (res: Response) => res.status(401),
  forbidden: (res: Response) => res.status(403),
  notFound: (res: Response) => res.status(404),
  conflict: (res: Response) => res.status(409),
  internalServerError: (res: Response) => res.status(500),
};

