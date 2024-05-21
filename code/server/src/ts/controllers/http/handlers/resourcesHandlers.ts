import PromiseRouter from 'express-promise-router';
import {
  ResourceInputModel,
  WorkspaceResource,
  WorkspaceResourceMetadata,
} from '@notespace/shared/src/workspace/types/resource';
import { httpResponse } from '@controllers/http/utils/httpResponse';
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
    // Validate workspace id
    const { wid } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');

    // Get resource input model
    const resource = req.body as ResourceInputModel;
    if (!resource) throw new InvalidParameterError('Body is required');
    const { type, name, parent } = resource;
    if (!type) throw new InvalidParameterError('Resource type is required');

    const id = await service.createResource(wid, name, type, parent);
    const createdResource: WorkspaceResourceMetadata = { id, ...resource, children: [], parent: parent || wid };
    io.in(wid).emit('createdResource', createdResource);
    httpResponse.created(res).json({ id });
  };

  /**
   * Get a resource by its id
   * @param req
   * @param res
   */
  const getResource = async (req: Request, res: Response) => {
    // Validate workspace id and resource id
    const { wid, id } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    if (!id) throw new InvalidParameterError('Resource id is required');

    // Get resource metadata query parameter
    const { metaOnly } = req.query;
    const resource = await service.getResource(wid, id, metaOnly === 'true');
    httpResponse.ok(res).json(resource);
  };

  /**
   * Update a resource
   * @param req
   * @param res
   */
  const updateResource = async (req: Request, res: Response) => {
    // Validate workspace id and resource id
    const { wid, id } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    if (!id) throw new InvalidParameterError('Resource id is required');

    // Get resource input model
    const resource = req.body as Partial<WorkspaceResource>;
    if (!resource) throw new InvalidParameterError('Body is required');

    await service.updateResource(id, resource);
    io.in(wid).emit('updatedResource', { id, ...resource });
    httpResponse.noContent(res).send();
  };

  /**
   * Delete a resource
   * @param req
   * @param res
   */
  const deleteResource = async (req: Request, res: Response) => {
    // Validate workspace id and resource id
    const { wid, id } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    if (!id) throw new InvalidParameterError('Resource id is required');

    await service.deleteResource(id);
    io.in(wid).emit('deletedResource', id);
    httpResponse.noContent(res).send();
  };

  const router = PromiseRouter({ mergeParams: true });
  router.post('/', createResource);
  router.get('/:id', getResource);
  router.put('/:id', updateResource);
  router.delete('/:id', deleteResource);

  return router;
}

export default resourcesHandlers;
