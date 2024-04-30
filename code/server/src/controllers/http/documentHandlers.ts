import { Request, Response } from 'express';
import { DocumentService } from '@src/types';

function documentHandlers(service: DocumentService) {
  async function getDocuments(req: Request, res: Response) {
    const documents = await service.getDocuments();
    res.status(200).send(documents);
  }

  async function createDocument(req: Request, res: Response) {
    const id = await service.createDocument();
    res.status(201).send({ id });
  }

  async function getDocument(req: Request, res: Response) {
    const document = await service.getDocument(req.params.id);
    res.status(200).send(document);
  }

  async function deleteDocument(req: Request, res: Response) {
    service.deleteDocument(req.params.id);
    res.status(200).send();
  }

  return {
    getDocuments,
    createDocument,
    getDocument,
    deleteDocument,
  };
}

export default documentHandlers;
