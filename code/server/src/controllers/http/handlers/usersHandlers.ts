import PromiseRouter from 'express-promise-router';
import { Request, Response } from 'express';
import { UsersService } from '@services/UsersService';
import { httpResponse } from '@controllers/http/utils/httpResponse';
import { UserData } from '@notespace/shared/src/users/types';
import { verifyToken } from '@controllers/http/middlewares/authMiddleware';

function usersHandlers(service: UsersService) {
  const registerUser = async (req: Request, res: Response) => {
    const { id, ...data } = req.body;
    try {
      const user = await service.getUser(id);
      if (user) {
        // user already registered
        httpResponse.noContent(res).send();
        return;
      }
    } catch (e) {
      // user not found, continue
      await service.createUser(id, data);
      httpResponse.created(res).send();
    }
  };

  const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await service.getUser(id);
    httpResponse.ok(res).json(user);
  };

  const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ...data } = req.body as UserData;
    await service.updateUser(id, data);
    httpResponse.noContent(res).send();
  };

  const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    await service.deleteUser(id);
    httpResponse.noContent(res).send();
  };

  const getUsers = async (req: Request, res: Response) => {
    const users = await service.getUsers();
    httpResponse.ok(res).json(users);
  };

  const router = PromiseRouter({ mergeParams: true });
  router.post('/', verifyToken, registerUser);
  router.put('/:id', verifyToken, updateUser);
  router.delete('/:id', verifyToken, deleteUser);
  router.get('/:id', getUser);
  router.get('/', getUsers);

  return router;
}

export default usersHandlers;
