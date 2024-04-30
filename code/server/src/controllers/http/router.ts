import express from 'express';
import PromiseRouter from 'express-promise-router';
import { DocumentService } from '@src/types';
import documentHandlers from '@controllers/http/documentHandlers';
import errorHandler from '@controllers/http/errorHandler';

export default function (service: DocumentService) {
  if (!service) {
    throw new Error('Service parameter is required');
  }
  const { getDocuments, createDocument, getDocument, deleteDocument } = documentHandlers(service);

  const router = PromiseRouter(); // automatically routes unhandled errors to error handling middleware
  router.use(express.urlencoded({ extended: true }));
  router.use(errorHandler);

  router.get('/', (req, res) => {
    res.send('Welcome to NoteSpace');
  });
  router.get('/documents', getDocuments);
  router.post('/documents', createDocument);
  router.get('/documents/:id', getDocument);
  router.delete('/documents/:id', deleteDocument);

  return router;
}
