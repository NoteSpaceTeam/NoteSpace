import { useEffect, useState } from 'react';
import { DocumentResourceMetadata } from '@notespace/shared/src/workspace/types/resource.ts';
import useSocketListeners from '@/services/communication/socket/useSocketListeners.ts';
import useWorkspace from '@domain/workspace/useWorkspace.ts';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource.ts';
import { useCommunication } from '@/services/communication/context/useCommunication.ts';
import useDocumentServices from '@/services/useDocumentServices.ts';

export function useDocuments() {
  const { socket } = useCommunication();
  const { workspace } = useWorkspace();
  const services = useDocumentServices();
  const [documents, setDocuments] = useState<DocumentResourceMetadata[]>([]);

  useEffect(() => {
    const documents = workspace?.resources.filter(
      res => res.type === ResourceType.DOCUMENT
    ) as DocumentResourceMetadata[];
    setDocuments(documents || []);
  }, [workspace]);

  function onCreateDocument(id: string, name?: string) {
    const document: DocumentResourceMetadata = { id, name: name || '', type: ResourceType.DOCUMENT };
    setDocuments(prev => [...prev, document]);
  }

  async function createDocument(title: string = '') {
    const id = await services.createDocument(title);
    onCreateDocument(id, title);
  }

  function onDeleteDocument(id: string) {
    setDocuments(documents.filter(res => res.id !== id));
  }

  async function deleteDocument(id: string) {
    await services.deleteDocument(id);
    onDeleteDocument(id);
  }

  function onUpdateDocument(id: string, title: string) {
    setDocuments(documents.map(doc => (doc.id === id ? { ...doc, title } : doc)));
  }

  async function updateDocument(id: string, title: string) {
    await services.updateDocument(id, title);
    onUpdateDocument(id, title);
  }

  useSocketListeners(socket, {
    documentCreated: onCreateDocument,
    documentDeleted: onDeleteDocument,
    documentUpdated: onUpdateDocument,
  });

  return {
    documents,
    createDocument,
    deleteDocument,
    updateDocument,
  };
}

export default useDocuments;
