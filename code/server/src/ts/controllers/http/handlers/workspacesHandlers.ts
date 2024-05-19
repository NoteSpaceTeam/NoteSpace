import PromiseRouter from 'express-promise-router';
import resourcesHandlers from '@controllers/http/handlers/resourcesHandlers';
import { httpResponse } from '@controllers/http/utils/httpResponse';
import { Request, Response } from 'express';
import { WorkspaceInputModel, WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import { Services } from '@services/Services';
import { Server } from 'socket.io';
import { InvalidParameterError } from '@domain/errors/errors';
import { isValidMetaOnlyValue, isValidUUID } from '@src/utils/validators';

function workspacesHandlers(services: Services, io: Server) {
  /**
   * Create a new workspace
   */
  const createWorkspace = async (req: Request, res: Response) => {
    const { name } = req.body as WorkspaceInputModel;
    if (!name) throw new InvalidParameterError('Workspace name is required');
    const id = await services.workspace.createWorkspace(name);

    io.emit('createdWorkspace', { id, name });
    httpResponse.created(res).json({ id });
  };

  /**
   * Get all workspaces
   */
  const getWorkspaces = async (req: Request, res: Response) => {
    const workspaces = await services.workspace.getWorkspaces();
    httpResponse.ok(res).json(workspaces);
  };

  /**
   * Get a workspace by its id
   */
  const getWorkspace = async (req: Request, res: Response) => {
    const { wid } = req.params;
    const { metaOnly } = req.query;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    if (!isValidUUID(wid)) throw new InvalidParameterError('Invalid workspace id');
    if (!isValidMetaOnlyValue(metaOnly as string)) throw new InvalidParameterError('Invalid metaOnly value');

    const workspace = await services.workspace.getWorkspace(wid, metaOnly === 'true');
    httpResponse.ok(res).json(workspace);
  };

  const updateWorkspace = async (req: Request, res: Response) => {
    const { wid } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    if (!isValidUUID(wid)) throw new InvalidParameterError('Invalid workspace id');
    const { name } = req.body as WorkspaceMetaData;
    if (!name) throw new InvalidParameterError('Workspace name is required');

    await services.workspace.updateWorkspace(wid, name);
    io.emit('updatedWorkspace', { id: wid, name } as WorkspaceMetaData);
    httpResponse.noContent(res).send();
  };

  /**
   * Delete a workspace
   * @param req
   * @param res
   */
  const deleteWorkspace = async (req: Request, res: Response) => {
    const { wid } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    if (!isValidUUID(wid)) throw new InvalidParameterError('Invalid workspace id');

    await services.workspace.deleteWorkspace(wid);
    io.emit('deletedWorkspace', wid);
    httpResponse.noContent(res).send();
  };

  const router = PromiseRouter();
  router.post('/', createWorkspace);
  router.get('/', getWorkspaces);
  router.get('/:wid', getWorkspace);
  router.put('/:wid', updateWorkspace);
  router.delete('/:wid', deleteWorkspace);

  // sub-routes for resources (documents and folders)
  router.use('/:wid', resourcesHandlers(services.resources, io));
  return router;
}

export default workspacesHandlers;
