import { Express } from 'express';
import request = require('supertest');
import { DocumentResource, ResourceInputModel, ResourceType } from '@notespace/shared/src/workspace/types/resource';

export function documentRequests(app: Express) {
  async function createDocument(wid: string, name?: string): Promise<string> {
    const resource: ResourceInputModel = {
      name: name || 'Untitled',
      type: ResourceType.DOCUMENT,
    };
    const response = await request(app).post(`/workspaces/${wid}`).send(resource);
    expect(response.status).toBe(201);
    return response.body.id;
  }

  async function getDocument(wid: string, id: string): Promise<DocumentResource> {
    const response = await request(app).get(`/workspaces/${wid}/${id}`);
    expect(response.status).toBe(200);
    if (response.body.type !== ResourceType.DOCUMENT) throw new Error('Resource is not a document');
    return response.body;
  }

  async function updateDocument(wid: string, id: string, name: string) {
    const response = await request(app).put(`/workspaces/${wid}/${id}`).send({ name });
    expect(response.status).toBe(204);
  }

  async function deleteDocument(wid: string, id: string) {
    const response = await request(app).delete(`/workspaces/${wid}/${id}`);
    expect(response.status).toBe(204);
  }

  return { createDocument, getDocument, updateDocument, deleteDocument };
}
