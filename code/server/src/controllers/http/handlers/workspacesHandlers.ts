import PromiseRouter from 'express-promise-router';
import resourcesHandlers from '@controllers/http/handlers/resourcesHandlers';
import { httpResponse } from '@controllers/http/utils/httpResponse';
import { NextFunction, Request, Response } from 'express';
import { WorkspaceInputModel, WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { Services } from '@services/Services';
import { Server } from 'socket.io';
import { ForbiddenError, InvalidParameterError } from '@domain/errors/errors';
import { verifyToken } from '@controllers/http/middlewares/authMiddleware';

function workspacesHandlers(services: Services, io: Server) {
  const createWorkspace = async (req: Request, res: Response) => {
    const { name, isPrivate } = req.body as WorkspaceInputModel;
    if (!name) throw new InvalidParameterError('Workspace name is required');
    if (isPrivate === undefined) throw new InvalidParameterError('Workspace visibility is required');

    const member = req.user!.email;
    const id = await services.workspaces.createWorkspace(name, isPrivate);
    await services.workspaces.addWorkspaceMember(id, member);
    const workspace: WorkspaceMeta = {
      id,
      name,
      createdAt: new Date().toISOString(),
      members: [member],
      isPrivate,
    };
    io.emit('createdWorkspace', workspace);
    httpResponse.created(res).json({ id });
  };

  const getWorkspaces = async (req: Request, res: Response) => {
    const workspaces = await services.workspaces.getWorkspaces();
    httpResponse.ok(res).json(workspaces);
  };

  const getWorkspace = async (req: Request, res: Response) => {
    const { wid } = req.params;
    const { metaOnly } = req.query;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    const workspace = await services.workspaces.getWorkspace(wid);
    const resources = metaOnly === 'true' ? [] : await services.workspaces.getResources(wid);
    httpResponse.ok(res).json({ ...workspace, resources });
  };

  const updateWorkspace = async (req: Request, res: Response) => {
    const { wid } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');

    const { name } = req.body as WorkspaceMeta;
    if (!name) throw new InvalidParameterError('Workspace name is required');

    await services.workspaces.updateWorkspace(wid, name);
    io.emit('updatedWorkspace', { id: wid, name } as WorkspaceMeta);
    httpResponse.noContent(res).send();
  };

  const deleteWorkspace = async (req: Request, res: Response) => {
    const { wid } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');

    await services.workspaces.deleteWorkspace(wid);
    io.emit('deletedWorkspace', wid);
    httpResponse.noContent(res).send();
  };

  const addMemberToWorkspace = async (req: Request, res: Response) => {
    const { wid } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');

    const { email } = req.body;
    if (!email) throw new InvalidParameterError('Email is required');

    await services.workspaces.addWorkspaceMember(wid, email);
    httpResponse.noContent(res).send();
  };

  const removeMemberFromWorkspace = async (req: Request, res: Response) => {
    const { wid } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');

    const { email } = req.body;
    if (!email) throw new InvalidParameterError('Email is required');

    await services.workspaces.removeWorkspaceMember(wid, email);
    httpResponse.noContent(res).send();
  };

  async function canAccessWorkspace(req: Request, res: Response, next: NextFunction) {
    // is a workspace member or workspace is public
    const { wid } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    const workspace = await services.workspaces.getWorkspace(wid);
    if (!workspace) throw new InvalidParameterError('Workspace not found');
    if (workspace.isPrivate && !workspace.members.find(m => m === req.user?.email)) {
      throw new ForbiddenError('User is not a member of this workspace');
    }
    next();
  }

  const router = PromiseRouter();
  router.post('/', verifyToken, createWorkspace);
  router.get('/', getWorkspaces);
  router.get('/:wid', canAccessWorkspace, getWorkspace);
  router.put('/:wid', verifyToken, canAccessWorkspace, updateWorkspace);
  router.delete('/:wid', verifyToken, canAccessWorkspace, deleteWorkspace);
  router.post('/:wid/members', verifyToken, canAccessWorkspace, addMemberToWorkspace);
  router.delete('/:wid/members', verifyToken, canAccessWorkspace, removeMemberFromWorkspace);

  // sub-routes for resources (documents and folders)
  router.use('/:wid', canAccessWorkspace, resourcesHandlers(services.resources, io));
  return router;
}

export default workspacesHandlers;
