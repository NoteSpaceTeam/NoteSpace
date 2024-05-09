import PromiseRouter from 'express-promise-router';
import { NoteSpaceServices, ResourcesService } from '@services/types';
import { ResourceInputModel, WorkspaceResource } from '@notespace/shared/workspace/types/resource';
import { httpResponse } from '@controllers/http/utils';
import { Request, Response } from 'express';

function resourcesHandlers(services : ResourcesService) {
  const router = PromiseRouter();

  const createResource = async (req : Request, res : Response) => {
    const resource = req.body as ResourceInputModel;
    const id = await services.createResource(resource);
    return httpResponse.created(res).json({ id });
  }

  const getResource = async (req : Request, res: Response) => {
    const id = req.params.resId;
    const resource = await services.getResource(id);

    if (!resource) {
      return httpResponse.notFound(res).send();
    }

    return httpResponse.ok(res).json(resource);
  }

  const updateResource = async (req : Request, res : Response) => {
    const resource = req.body as Partial<WorkspaceResource>
    if (!resource.id) {
      return httpResponse.badRequest(res).send('Resource id is required');
    }
    await services.updateResource(resource);
    return httpResponse.noContent(res).send();
  }

  const deleteResource = async (req : Request, res : Response) => {
    const id = req.params.resId;
    await services.deleteResource(id);
    return httpResponse.noContent(res).send();
  }

  router.post('/', createResource);
  router.get('/:resId', getResource);
  router.put('/:resId', updateResource);
  router.delete('/:resId', deleteResource);

  return router;
}

export default resourcesHandlers;