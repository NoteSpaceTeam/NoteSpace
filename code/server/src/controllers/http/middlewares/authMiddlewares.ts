import { NextFunction, Request, Response } from 'express';
import { httpResponse } from '@controllers/http/utils/httpResponse';
import { UserData } from '@notespace/shared/src/users/types';
import { ErrorLogger } from '@src/utils/logging';
import admin from 'firebase-admin';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserData;
    }
  }
}

// middleware that injects the user object into the request if it has a valid session cookie
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionCookie = req.cookies?.session;
  if (!sessionCookie) {
    return next();
  }
  try {
    req.user = await verifySessionCookie(sessionCookie);
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

async function verifySessionCookie(sessionCookie: string): Promise<UserData> {
  const idToken = await admin.auth().verifySessionCookie(sessionCookie, true);
  const { uid, displayName, email } = await admin.auth().getUser(idToken.uid);
  return { id: uid, email: email!, name: displayName! };
}
