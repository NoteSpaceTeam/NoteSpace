import express, { Request, Response } from 'express';

export default function (service: Service) {
  if (!service) {
    throw new Error('Services parameter is required');
  }

  function getDocument(req: Request, res: Response) {
    const content = service.getTree();
    res.send(content);
  }

  const router = express.Router();
  router.use(express.urlencoded({ extended: true }));

  router.get('/', (req, res) => {
    res.send('Welcome to NoteSpace');
  });
  router.get('/document', getDocument);

  return router;
}
