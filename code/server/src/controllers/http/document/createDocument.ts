import { Request, Response } from 'express';
import { DocumentService } from '@src/types';

function createDocument(service: DocumentService) {
  return async (req: Request, res: Response) => {
    const id = await service.createDocument();
    res.status(201).send({ id });
  };
}

export default createDocument;
