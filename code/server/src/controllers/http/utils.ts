import { Response } from 'express';

export const httpResponse = {
  ok: (res: any, data: any) => res.status(200).send(data),
  created: (res: Response, data: any) => res.status(201).send(data),
  noContent: (res: Response) => res.status(204).send(),
};

export const httpErrorResponse = {
  badRequest: (res: Response, message: string) => res.status(400).send({ message }),
  notFound: (res: Response, message: string) => res.status(404).send({ message }),
  conflict: (res: Response, message: string) => res.status(409).send({ message }),
  internalServerError: (res: Response, message: string) => res.status(500).send({ message }),
};
