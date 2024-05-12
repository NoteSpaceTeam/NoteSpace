import express from 'express';
import PromiseRouter from 'express-promise-router';
import { Services } from '@services/Services';
import workspacesHandlers from '@controllers/http/handlers/workspacesHandlers';
import errorHandler from '@controllers/http/handlers/errorHandler';
import { Server } from 'socket.io';

export default function (services: Services, io: Server) {
  if (!services) throw new Error('Services parameter is required');

  const router = PromiseRouter(); // automatically routes unhandled errors to error handling middleware
  router.use(express.urlencoded({ extended: true }));

  router.use('/workspaces', workspacesHandlers(services, io));
  router.use(errorHandler);
  return router;
}
