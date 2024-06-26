import { ResourcesService } from '@services/ResourcesService';
import { Request, Response } from 'express';
import { httpResponse } from '@controllers/http/utils/httpResponse';

function recentDocumentsHandler(service: ResourcesService) {
  return async (req: Request, res: Response) => {
    const documents = await service.getRecentDocuments(req.user!.email);
    httpResponse.ok(res).json(documents);
  };
}

export default recentDocumentsHandler;
