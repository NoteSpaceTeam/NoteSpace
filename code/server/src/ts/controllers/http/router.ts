import express from 'express';
import PromiseRouter from 'express-promise-router';
import { DocumentService, NoteSpaceServices } from '@services/types';
import documentHandlers from '@controllers/http/workspace/documentHandlers';
import errorHandler from '@controllers/http/errorHandler';
import resourcesHandlers from '@controllers/http/workspace/resourcesHandlers';
import workspaceHandlers from '@controllers/http/workspace/workspaceHandlers';

export default function (service: NoteSpaceServices) {
  if (!service) throw new Error('Service parameter is required');

  const router = PromiseRouter(); // automatically routes unhandled errors to error handling middleware
  router.use(express.urlencoded({ extended: true }));

  router.use('/workspaces', workspaceHandlers(service));
  router.use(errorHandler);
  return router;
}
