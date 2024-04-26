import express from 'express';
import { DocumentService } from '@src/types';
import getDocument from '@controllers/http/document/getDocument';
import deleteDocument from '@controllers/http/document/deleteDocument';
import createDocument from '@controllers/http/document/createDocument';

export default function (service: DocumentService) {
  if (!service) {
    throw new Error('Service parameter is required');
  }
  const router = express.Router();
  router.use(express.urlencoded({ extended: true }));

  router.get('/', (req, res) => {
    res.send('Welcome to NoteSpace');
  });
  router.post('/documents', createDocument(service));
  router.get('/documents/:id', getDocument(service));
  router.delete('/documents/:id', deleteDocument(service));

  return router;
}
