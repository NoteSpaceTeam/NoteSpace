import { Request, Response } from 'express';
import { httpResponse } from '@controllers/http/utils';
import PromiseRouter from 'express-promise-router';
import { DocumentService } from '@services/documentService';

function documentHandlers(service: DocumentService) {

  const router = PromiseRouter();

  /**
   * Open document - get document content saved in firestore
   * @param req
   * @param res
   */
  const getDocument = async (req: Request, res: Response) => {
    const { id: workspaceId, docId } = req.params;
    const document = await service.getDocument(workspaceId, docId);
    httpResponse.ok(res).json(document);
  }

  /**
   * Update document - update document content in firestore - used for real-time operations that don't require postgres updates
   * @param req
   * @param res
   */
  const updateDocument = async (req: Request, res: Response) => {
    const {id, workspace, operations} = req.body // TODO: convert into InputModel
    await service.updateDocument(workspace, id, operations);
    httpResponse.noContent(res);
  }

  router.put('/', updateDocument);
  router.get('/:docId', getDocument);

  return router;
}

export default documentHandlers;
