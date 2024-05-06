import { Request, Response } from 'express';
import { DocumentService } from '@src/types';

function documentHandlers(service: DocumentService) {
  async function getDocuments(req: Request, res: Response) {
    const documents = await service.getDocuments();
    res.status(200).send(documents);
  }

  async function createDocument(req: Request, res: Response) {
    const { title } = req.body;
    const id = await service.createDocument(title);
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

  async function updateDocument(req: Request, res: Response) {
    const { id } = req.params;
    const { title } = req.body;
    await service.updateTitle(id, title);
    res.status(200).send();
  }

  return {
    getDocuments,
    createDocument,
    getDocument,
    deleteDocument,
    updateDocument,
  };
}

export default documentHandlers;
