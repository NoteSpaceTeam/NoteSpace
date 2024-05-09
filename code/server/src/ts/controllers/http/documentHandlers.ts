import { Request, Response } from 'express';
import { DocumentService } from '@controllers/ws/types';
import { httpResponse } from '@controllers/http/utils';

function documentHandlers(service: DocumentService) {
  async function getDocuments(req: Request, res: Response) {
    const documents = await service.getDocuments();
    httpResponse.ok(res, documents);
  }

  async function createDocument(req: Request, res: Response) {
    const { title } = req.body;
    const id = await service.createDocument(title);
    httpResponse.created(res, { id });
  }

  async function getDocument(req: Request, res: Response) {
    const document = await service.getDocument(req.params.id);
    httpResponse.ok(res, document);
  }

  async function deleteDocument(req: Request, res: Response) {
    service.deleteDocument(req.params.id);
    httpResponse.noContent(res);
  }

  async function updateDocument(req: Request, res: Response) {
    const { id } = req.params;
    const { title } = req.body;
    await service.updateTitle(id, title);
    httpResponse.noContent(res);
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
