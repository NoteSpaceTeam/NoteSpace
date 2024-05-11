import PromiseRouter from 'express-promise-router';
import { ResourceInputModel, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { httpResponse } from '@controllers/http/httpResponse';
import { Request, Response } from 'express';
import { ResourcesService } from '@services/ResourcesService';
import { InvalidParameterError } from '@domain/errors/errors';
import { Server } from 'socket.io';

function resourcesHandlers(service: ResourcesService, io: Server) {
  /**
   * Create a new resource in a workspace
   * @param req
   * @param res
   */
  const createResource = async (req: Request, res: Response) => {
    const { wid } = req.params;
    const resource = req.body as ResourceInputModel;
    if (!resource) throw new InvalidParameterError('Body is required');
    const { type, name, parent } = resource;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    if (!type) throw new InvalidParameterError('Resource type is required');
    if (!parent) throw new InvalidParameterError('Resource parent is required');
    const id = await service.createResource(wid, name, type, parent);
    io.of('/workspaces').in(wid).emit('resources:create', { id, name, type, parent });
    httpResponse.created(res).json({ id });
  };

  /**
   * Get a resource by its id
   * @param req
   * @param res
   */
  const getResource = async (req: Request, res: Response) => {
    const { wid, id, metaOnly } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    if (!id) throw new InvalidParameterError('Resource id is required');
    const resource = await service.getResource(wid, id, metaOnly === 'true');
    httpResponse.ok(res).json(resource);
  };

  /**
   * Update a resource
   * @param req
   * @param res
   */
  const updateResource = async (req: Request, res: Response) => {
    const { wid, id } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    if (!id) throw new InvalidParameterError('Resource id is required');
    const resource = req.body as Partial<WorkspaceResource>;
    if (!resource) throw new InvalidParameterError('Body is required');
    await service.updateResource(id, resource);
    io.of('/workspaces').in(wid).emit('resources:update', resource);
    httpResponse.noContent(res).send();
  };

  /**
   * Delete a resource
   * @param req
   * @param res
   */
  const deleteResource = async (req: Request, res: Response) => {
    const { wid, id } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    if (!id) throw new InvalidParameterError('Resource id is required');
    await service.deleteResource(id);
    io.of('/workspaces').in(wid).emit('resources:delete', { id });
    httpResponse.noContent(res).send();
  };

  const router = PromiseRouter({mergeParams: true});
  router.post('/', createResource);
  router.get('/:id', getResource);
  router.put('/:id', updateResource);
  router.delete('/:id', deleteResource);

  return router;
}

export default resourcesHandlers;
