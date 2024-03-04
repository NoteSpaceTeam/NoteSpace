import express, { Request, Response } from 'express';

export default function (service: Service) {
  if (!service) {
    throw new Error('Services parameter is required');
  }

  function getDocument(req: Request, res: Response) {
    const content = service.getDocument();
    res.send({ content });
  }

  function deleteDocument(req: Request, res: Response) {
    service.deleteDocument();
    res.sendStatus(200);
  }

  const router = express.Router();
  router.use(express.urlencoded({ extended: true }));

  router.get('/', (req, res) => {
    res.send('Welcome to NoteSpace');
  });
  router.get('/document', getDocument);
  router.delete('/document', deleteDocument);

  return router;
}
