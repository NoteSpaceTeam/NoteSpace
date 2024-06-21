import PromiseRouter from 'express-promise-router';
import { CookieOptions, Request, Response } from 'express';
import { UsersService } from '@services/UsersService';
import { httpResponse } from '@controllers/http/utils/httpResponse';
import { UserData } from '@notespace/shared/src/users/types';
import { enforceAuth } from '@controllers/http/middlewares/authMiddlewares';
import admin from 'firebase-admin';
import { UnauthorizedError } from '@domain/errors/errors';

function usersHandlers(service: UsersService) {
  const sessionLogin = async (req: Request, res: Response) => {
    const { idToken } = req.body;
    // session login - create session cookie, verifying ID token in the process
    try {
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
      const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
      const options: CookieOptions = { maxAge: expiresIn, httpOnly: true, secure: true, sameSite: 'none' };
      res.cookie('session', sessionCookie, options);
    } catch (e) {
      throw new UnauthorizedError('Failed to login user');
    }

    // register user in database if not already registered
    const { uid } = await admin.auth().verifyIdToken(idToken);
    try {
      const user = await service.getUser(uid);
      if (user) {
        // user already registered
        httpResponse.noContent(res).send();
        return;
      }
    } catch (e) {
      // user not found, continue
      const user = await admin.auth().getUser(uid);
      const userData = { name: user.displayName!, email: user.email! };
      await service.createUser(uid, userData);
      httpResponse.created(res).send();
    }
  };

  const sessionLogout = async (req: Request, res: Response) => {
    res.clearCookie('session');
    httpResponse.noContent(res).send();
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
  router.post('/login', sessionLogin);
  router.post('/logout', enforceAuth, sessionLogout);
  router.get('/:id', getUser);
  router.get('/', getUsers);
  router.put('/:id', enforceAuth, updateUser);
  router.delete('/:id', enforceAuth, deleteUser);

  return router;
}

export default usersHandlers;
