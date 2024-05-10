import express from 'express';
import PromiseRouter from 'express-promise-router';
import { NoteSpaceServices } from '@services/noteSpaceServices';
import workspaceHandlers from '@controllers/http/workspace/workspaceHandlers';
import errorHandler from '@controllers/http/errorHandler';

export default function (service: NoteSpaceServices) {
  if (!service) throw new Error('Service parameter is required');

  const router = PromiseRouter(); // automatically routes unhandled errors to error handling middleware
  router.use(express.urlencoded({ extended: true }));

  router.use('/workspaces', workspaceHandlers(service));
  router.use(errorHandler);
  return router;
}
