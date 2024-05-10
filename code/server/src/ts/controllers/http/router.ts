import express from 'express';
import PromiseRouter from 'express-promise-router';
import { Services } from '@services/Services';
import workspaceHandlers from '@controllers/http/workspace/workspaceHandlers';
import errorHandler from '@controllers/http/errorHandler';

export default function (services: Services) {
  if (!services) throw new Error('Services parameter is required');

  const router = PromiseRouter(); // automatically routes unhandled errors to error handling middleware
  router.use(express.urlencoded({ extended: true }));

  router.use('/workspaces', workspaceHandlers(services));
  router.use(errorHandler);
  return router;
}
