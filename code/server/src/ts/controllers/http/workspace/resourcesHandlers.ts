import PromiseRouter from 'express-promise-router';
import { ResourceInputModel, WorkspaceResource } from '@notespace/shared/workspace/types/resource';
import { httpResponse } from '@controllers/http/httpResponse';
import { Request, Response } from 'express';
import { ResourcesService } from '@services/resourcesService';

function resourcesHandlers(services : ResourcesService) {
  const router = PromiseRouter();

  /**
   * Create a new resource -
   * @param req
   * @param res
   */
  const createResource = async (req : Request, res : Response) => {
    const resource = req.body as ResourceInputModel;
    const id = await services.createResource(resource);

    if (!id) return httpResponse.internalServerError(res).send();

    return httpResponse.created(res).json({ id });
  }

  /**
   * Get a resource by its id
   * @param req
   * @param res
   */
  const getResource = async (req : Request, res: Response) => {
    const id = req.params.resId;
    const resource = await services.getResource(id);

    if (!resource) return httpResponse.notFound(res).send();

    return httpResponse.ok(res).json(resource);
  }


  const getDocContent = async (req : Request, res : Response) => {
    const {wid, rid} = req.params;
    const content = await services.getDocContent(wid, rid);
    return httpResponse.ok(res).json(content);
  }

  /**
   * Update a resource
   * @param req
   * @param res
   */
  const updateResource = async (req : Request, res : Response) => {
    const resource = req.body as Partial<WorkspaceResource>

    if (!resource.id) return httpResponse.badRequest(res).send('Resource id is required');

    await services.updateResource(resource);
    return httpResponse.noContent(res).send();
  }

  /**
   * Delete a resource
   * @param req
   * @param res
   */
  const deleteResource = async (req : Request, res : Response) => {
    const id = req.params.resId;
    await services.deleteResource(id);
    return httpResponse.noContent(res).send();
  }

  router.post('/', createResource);
  router.get('/:rid', getResource);
  router.get('/:rid/content', getDocContent);

  router.put('/:rid', updateResource);
  router.delete('/:rid', deleteResource);

  return router;
}

export default resourcesHandlers;