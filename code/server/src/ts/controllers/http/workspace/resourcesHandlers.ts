import PromiseRouter from 'express-promise-router';
import { ResourceInputModel, WorkspaceResource } from '@notespace/shared/workspace/types/resource';
import { httpResponse } from '@controllers/http/httpResponse';
import { Request, Response } from 'express';
import { ResourcesService } from '@services/ResourcesService';
import { InvalidParameterError } from '@domain/errors/errors';

function resourcesHandlers(service: ResourcesService) {
  /**
   * Create a new resource in a workspace
   * @param req
   * @param res
   */
  const createResource = async (req: Request, res: Response) => {
    const resource = req.body as ResourceInputModel;
    if (!resource) throw new InvalidParameterError('Body is required');
    const { workspace, type, name, parent } = resource;
    if (!workspace) throw new InvalidParameterError('Workspace id is required');
    if (!type) throw new InvalidParameterError('Resource type is required');
    if (!name) throw new InvalidParameterError('Resource name is required');
    if (!parent) throw new InvalidParameterError('Resource parent is required');
    const id = await service.createResource(workspace, name, type, parent);
    return httpResponse.created(res).json({ id });
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
    return httpResponse.ok(res).json(resource);
  };

  /**
   * Update a resource
   * @param req
   * @param res
   */
  const updateResource = async (req: Request, res: Response) => {
    const resource = req.body as Partial<WorkspaceResource>;
    if (!resource) throw new InvalidParameterError('Body is required');
    if (!resource.id) throw new InvalidParameterError('Resource id is required');
    await service.updateResource(resource);
    return httpResponse.noContent(res).send();
  };

  /**
   * Delete a resource
   * @param req
   * @param res
   */
  const deleteResource = async (req: Request, res: Response) => {
    const { id } = req.params;
    await service.deleteResource(id);
    return httpResponse.noContent(res).send();
  };

  const router = PromiseRouter();
  router.post('/', createResource);
  router.get('/:id', getResource);
  router.put('/:id', updateResource);
  router.delete('/:id', deleteResource);

  return router;
}

export default resourcesHandlers;
