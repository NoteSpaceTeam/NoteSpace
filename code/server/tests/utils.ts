import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import express, { Express } from 'express';
import serviceInit from '../src/services/documentService';
import database from '../src/database/memory/operations';
import eventsInit from '../src/controllers/socket/events';
import router from '../src/controllers/http/router';
import cors from 'cors';
import app from '../src/server';

export function treeToString<T>(tree: FugueTree<T>): string {
  let result = '';
  for (const node of tree.traverse(tree.root)) {
    result += node.value;
  }
  return result;
}

export function getApp(): Express {
  const service = serviceInit(database);
  const api = router(service);
  const app = express();

  app.use(cors({ origin: '*' }));
  app.use('/', api);
  return app;
}
