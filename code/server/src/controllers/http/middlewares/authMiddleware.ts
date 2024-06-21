import admin from 'firebase-admin';
import { NextFunction, Request, Response } from 'express';
import { httpResponse } from '@controllers/http/utils/httpResponse';
import { LoggedUser } from '@notespace/shared/src/users/types';
import { ErrorLogger } from '@src/utils/logging';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: LoggedUser;
    }
  }
}

// middleware that injects the user object into the request if it has a valid session cookie
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionCookie = req.cookies.session;
  if (!sessionCookie) {
    return next();
  }
  try {
    const idToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    const { uid, displayName, email } = await admin.auth().getUser(idToken.uid);
    req.user = { id: uid, email: email!, name: displayName! };
    next();
  } catch (error) {
    ErrorLogger.logError('Request with invalid session token');
    return httpResponse.unauthorized(res).send({ error: 'Invalid session token, please login again' });
  }
}

export async function enforceAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    ErrorLogger.logError('Unauthorized request');
    return httpResponse.unauthorized(res).send({ error: 'Unauthorized' });
  }
  next();
}
