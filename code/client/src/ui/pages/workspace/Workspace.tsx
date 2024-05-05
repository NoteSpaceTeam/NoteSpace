import { useEffect, useState } from 'react';
import { useCommunication } from '@/domain/communication/context/useCommunication';
import { DocumentData } from '@notespace/shared/crdt/types/document';
import WorkspaceHeader from '@ui/pages/workspace/components/WorkspaceHeader';
import DocumentPreview from '@ui/pages/workspace/components/DocumentPreview';
import useError from '@domain/error/useError';
import useWorkspace from '@domain/workspace/useWorkspace';
import './Workspace.scss';

function Workspace() {
  const communication = useCommunication();
  const [docs, setDocs] = useState<DocumentData[]>([]);
  const { showError } = useError();
  const { setFilePath } = useWorkspace();

  async function createDocument(title?: string) {
    const { id } = await communication.http.post('/documents', { title });
    setDocs(prev => [...prev, { id, title } as DocumentData]);
  }

  async function deleteDocument(id: string) {
    await communication.http.delete(`/documents/${id}`);
    setDocs(docs.filter(doc => doc.id !== id));
  }

  useEffect(() => {
    async function getDocuments() {
      const documents = await communication.http.get('/documents');
      setDocs(documents);
    }
    setFilePath('/documents');
    getDocuments().catch(showError);
  }, [communication, setFilePath, showError]);

  return (
    <div className="workspace">
      <h2>Workspace</h2>
      <WorkspaceHeader onCreateDocument={() => createDocument().catch(showError)} />
      <ul>
        {docs.map(document => (
          <DocumentPreview
            key={document.id}
            document={document}
            onDelete={() => deleteDocument(document.id).catch(showError)}
            onDuplicate={() => createDocument(document.title).catch(showError)}
            onRename={() => {
              /*TODO*/
            }}
          />
        ))}
      </ul>
    </div>
  );
}

export default Workspace;
