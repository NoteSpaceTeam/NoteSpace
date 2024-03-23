import { Request, Response } from 'express';
import { DocumentService } from '@src/types';

function getDocument(service: DocumentService) {
  return async (req: Request, res: Response) => {
    const tree = await service.getTree();
    res.status(200).send(tree);
  };
}

export default getDocument;
