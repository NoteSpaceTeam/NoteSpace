import express from 'express';
import { DocumentService } from '@src/types';
import getDocument from '@src/controllers/http/document/getDocument';
import deleteDocument from '@src/controllers/http/document/deleteDocument';

export default function (service: DocumentService) {
  if (!service) {
    throw new Error('Service parameter is required');
  }
  const router = express.Router();
  router.use(express.urlencoded({ extended: true }));

  router.get('/', (req, res) => {
    res.send('Welcome to NoteSpace');
  });
  router.get('/document', getDocument(service));
  router.delete('/document', deleteDocument(service));

  return router;
}
