import { enforceAuth } from '@controllers/http/middlewares/authMiddlewares';
import PromiseRouter from 'express-promise-router';
import { NextFunction, Request, Response } from 'express';
import { DocumentsService } from '@services/DocumentsService';
import { Server } from 'socket.io';
import { httpResponse } from '@controllers/http/utils/httpResponse';

function resourcesHandlers(
  service: DocumentsService,
  io: Server,
  workspaceWritePermissions: (req: Request, res: Response, next: NextFunction) => void
) {
  const commitVersion = async (req: Request, res: Response) => {
    const { id } = req.params;
    await service.commit(id);
    httpResponse.noContent(res).send();
  };

  const rollbackVersion = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { versionId } = req.body;
    if (!versionId) throw new Error('Version id is required');
    await service.rollback(id, versionId);
    httpResponse.noContent(res).send();
  };

  const forkVersion = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { versionId } = req.body;
    if (!versionId) throw new Error('Version id is required');
    const newResource = await service.fork(id, versionId);
    io.in(newResource.workspace).emit('createdResource', newResource);
    httpResponse.created(res).json({ id: newResource.id });
  };

  const getVersions = async (req: Request, res: Response) => {
    const { id } = req.params;
    const versions = await service.getVersions(id);
    httpResponse.ok(res).json(versions);
  };

  const router = PromiseRouter({ mergeParams: true });
  router.post('/commit', enforceAuth, workspaceWritePermissions, commitVersion);
  router.post('/rollback', enforceAuth, workspaceWritePermissions, rollbackVersion);
  router.post('/fork', enforceAuth, workspaceWritePermissions, forkVersion);
  router.get('/versions', getVersions);

  return router;
}

export default resourcesHandlers;
