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
  const commit = async (req: Request, res: Response) => {
    const { id } = req.params;
    const author = {
      name: req.user!.name,
      id: req.user!.id,
    };
    const commitId = await service.commit(id, author);
    httpResponse.created(res).send({ commitId });
  };

  const rollback = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { commitId } = req.body;
    if (!commitId) throw new Error('Commit id is required');
    await service.rollback(id, commitId);
    httpResponse.noContent(res).send();
  };

  const clone = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { commitId } = req.body;
    if (!commitId) throw new Error('Commit id is required');
    const newResource = await service.clone(id, commitId);
    io.in(newResource.workspace).emit('createdResource', newResource);
    httpResponse.created(res).json({ id: newResource.id });
  };

  const getCommits = async (req: Request, res: Response) => {
    const { id } = req.params;
    const commits = await service.getCommits(id);
    httpResponse.ok(res).json(commits);
  };

  const getCommit = async (req: Request, res: Response) => {
    const { id, commitId } = req.params;
    const commit = await service.getCommit(id, commitId);
    httpResponse.ok(res).json(commit);
  };

  const router = PromiseRouter({ mergeParams: true });
  router.post('/commit', enforceAuth, workspaceWritePermissions, commit);
  router.post('/rollback', enforceAuth, workspaceWritePermissions, rollback);
  router.post('/clone', enforceAuth, workspaceWritePermissions, clone);
  router.get('/commits', getCommits);
  router.get('/commits/:commitId', getCommit);

  return router;
}

export default resourcesHandlers;
