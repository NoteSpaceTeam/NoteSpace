import { Request, Response } from 'express';
import { DocumentService } from '@src/types';

function deleteDocument(service: DocumentService) {
  return (req: Request, res: Response) => {
    service.deleteDocument();
    res.status(200).send();
  };
}

export default deleteDocument;
