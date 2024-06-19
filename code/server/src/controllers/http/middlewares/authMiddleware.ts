import admin from 'firebase-admin';
import { NextFunction, Request, Response } from 'express';
import { httpResponse } from '@controllers/http/utils/httpResponse';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const { token } = req.cookies;
  if (!token) {
    return httpResponse.unauthorized(res).send();
  }
  try {
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return httpResponse.internalServerError(res).send();
  }
}
