import { Response } from 'express';

export const httpResponse = {
  ok: <T>(res: Response, data: T) => res.status(200).send(data),
  created: <T>(res: Response, data: T) => res.status(201).send(data),
  noContent: (res: Response) => res.status(204).send(),
};
