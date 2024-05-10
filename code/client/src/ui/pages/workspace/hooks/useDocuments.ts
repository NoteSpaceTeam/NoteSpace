import { useState } from 'react';
import { Communication } from '@/services/communication/communication.ts';
import { DocumentResourceMetadata } from '@notespace/shared/workspace/types/resource.ts';
import useSocketListeners from '@/services/communication/socket/useSocketListeners.ts';
import useWorkspace from '@domain/workspace/useWorkspace.ts';
import { ResourceType } from '@notespace/shared/workspace/types/resource.ts';

export function useDocuments({ http, socket }: Communication) {
  const { resources } = useWorkspace();
  const [documents, setDocuments] = useState<DocumentResourceMetadata[]>(
    resources.filter(res => res.type === ResourceType.DOCUMENT) as DocumentResourceMetadata[]
  );

  function onCreateDocument(id: string, name?: string) {
    const document: DocumentResourceMetadata = { id, name: name || '', type: ResourceType.DOCUMENT };
    setDocuments(prev => [...prev, document]);
  }

  async function createDocument(title?: string) {
    const { id } = await http.post('/documents', { title });
    onCreateDocument(id, title);
  }

  function onDeleteDocument(id: string) {
    setDocuments(documents.filter(res => res.id !== id));
  }

  async function deleteDocument(id: string) {
    await http.delete(`/documents/${id}`);
    onDeleteDocument(id);
  }

  function onUpdateDocument(id: string, title: string) {
    setDocuments(documents.map(doc => (doc.id === id ? { ...doc, title } : doc)));
  }

  async function updateDocument(id: string, title: string) {
    await http.put(`/documents/${id}`, { title });
    onUpdateDocument(id, title);
  }

  useSocketListeners(socket, {
    'document:create': onCreateDocument,
    'document:delete': onDeleteDocument,
    'document:update': onUpdateDocument,
  });

  return {
    documents,
    createDocument,
    deleteDocument,
    updateDocument,
  };
}

export default useDocuments;
