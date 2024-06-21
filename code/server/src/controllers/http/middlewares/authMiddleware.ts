import admin from 'firebase-admin';
import { NextFunction, Request, Response } from 'express';
import { httpResponse } from '@controllers/http/utils/httpResponse';
import { LoggedUser } from '@notespace/shared/src/users/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: LoggedUser;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionCookie = req.cookies.session || '';
  console.log('sessionCookie:', sessionCookie);
  if (!sessionCookie) {
    return next();
  }
  try {
    const idToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    console.log('idToken:', idToken);
    const { uid, displayName, email } = await admin.auth().getUser(idToken.uid);
    req.user = { id: uid, email: email!, name: displayName! };
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return httpResponse.unauthorized(res).send({ error: 'Invalid session token, please login again' });
  }
}

export async function enforceAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return httpResponse.unauthorized(res).send({ error: 'Unauthorized' });
  }
  next();
}
