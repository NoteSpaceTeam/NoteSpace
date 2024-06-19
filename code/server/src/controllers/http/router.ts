import express from 'express';
import PromiseRouter from 'express-promise-router';
import { Services } from '@services/Services';
import workspacesHandlers from '@controllers/http/handlers/workspacesHandlers';
import errorMiddleware from '@controllers/http/middlewares/errorMiddleware';
import usersHandlers from '@controllers/http/handlers/usersHandlers';
import { Server } from 'socket.io';
import { verifyToken } from '@controllers/http/middlewares/authMiddleware';

export default function (services: Services, io: Server) {
  if (!services) throw new Error('Services parameter is required');

  // automatically routes unhandled errors to error handling middleware
  const router = PromiseRouter();
  router.use(express.urlencoded({ extended: true }));

  router.use('/users', verifyToken, usersHandlers(services.users));
  router.use('/workspaces', verifyToken, workspacesHandlers(services, io));
  router.use(errorMiddleware);
  return router;
}
