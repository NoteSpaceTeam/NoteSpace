import PromiseRouter from 'express-promise-router';
import { ResourceInputModel, WorkspaceResource } from '@notespace/shared/workspace/resource';
import { httpResponse } from '@controllers/http/httpResponse';
import { Request, Response } from 'express';
import { ResourcesService } from '@services/resourcesService';
import { InvalidParameterError } from '@domain/errors/errors';

function resourcesHandlers(service: ResourcesService) {
  const router = PromiseRouter();

  /**
   * Create a new resource -
   * @param req
   * @param res
   */
  const createResource = async (req: Request, res: Response) => {
    const resource = req.body as ResourceInputModel;
    const id = await service.createResource(resource);
    return httpResponse.created(res).json({ id });
  };

  /**
   * Get a resource by its id
   * @param req
   * @param res
   */
  const getResource = async (req: Request, res: Response) => {
    const { wid, id, metaOnly } = req.params;
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

  router.post('/', createResource);
  router.get('/:id', getResource);
  router.put('/:id', updateResource);
  router.delete('/:id', deleteResource);

  return router;
}

export default resourcesHandlers;
