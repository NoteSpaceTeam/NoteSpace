import { useEffect, useState } from 'react';
import { useCommunication } from '@/services/communication/context/useCommunication';
import { DocumentData } from '@notespace/shared/workspace/types/document.d.ts';
import WorkspaceHeader from '@ui/pages/workspace/components/WorkspaceHeader';
import DocumentPreview from '@ui/pages/workspace/components/DocumentPreview';
import useError from '@domain/error/useError';
import useWorkspace from '@domain/workspace/useWorkspace';
import './Workspace.scss';

function Workspace() {
  const { http, socket } = useCommunication();
  const [docs, setDocs] = useState<DocumentData[]>([]);
  const { showError } = useError();
  const { setFilePath } = useWorkspace();

  async function createDocument(title?: string) {
    const { id } = await http.post('/documents', { title });
    setDocs(prev => [...prev, { id, title } as DocumentData]);
  }

  async function deleteDocument(id: string) {
    await http.delete(`/documents/${id}`);
    setDocs(docs.filter(doc => doc.id !== id));
  }

  async function updateDocument(id: string, title: string) {
    await http.put(`/documents/${id}`, { title });
  }

  useEffect(() => {
    async function getDocuments() {
      const documents = await http.get('/documents');
      setDocs(documents);
    }
    setFilePath('/documents');
    getDocuments().catch(showError);
    socket.connect('/workspace');
  }, [http, socket, setFilePath, showError]);

  return (
    <div className="workspace">
      <h2>Workspace</h2>
      <WorkspaceHeader onCreateDocument={() => createDocument().catch(showError)} />
      <ul>
        {docs.map(document => (
          <DocumentPreview
            key={document.id}
            doc={document}
            onDelete={() => deleteDocument(document.id).catch(showError)}
            onDuplicate={() => createDocument(document.title).catch(showError)}
            onRename={title => updateDocument(document.id, title).catch(showError)}
          />
        ))}
      </ul>
    </div>
  );
}

export default Workspace;
