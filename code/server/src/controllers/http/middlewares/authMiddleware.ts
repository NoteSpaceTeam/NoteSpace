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

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const { token } = req.cookies;
  if (!token) {
    return httpResponse.unauthorized(res).send();
  }
  try {
    const idToken = await admin.auth().verifyIdToken(token);
    const { uid, displayName, email } = await admin.auth().getUser(idToken.uid);
    req.user = { id: uid, email: email!, name: displayName! };
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return httpResponse.internalServerError(res).send();
  }
}
