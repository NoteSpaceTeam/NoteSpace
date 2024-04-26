import { Request, Response } from 'express';
import { DocumentService } from '@src/types';

function getDocument(service: DocumentService) {
  return async (req: Request, res: Response) => {
    const document = await service.getDocument(req.params.id);
    res.status(200).send(document);
  };
}

export default getDocument;
