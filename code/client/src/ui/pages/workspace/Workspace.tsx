import { useEffect, useState } from 'react';
import { useCommunication } from '@/domain/communication/context/useCommunication';
import { useNavigate } from 'react-router-dom';
import { Document } from '@notespace/shared/crdt/types/document';
import WorkspaceHeader from '@ui/pages/workspace/components/WorkspaceHeader';
import DocumentPreview from '@ui/pages/workspace/components/DocumentPreview';
import './Workspace.scss';
import useError from '@domain/error/useError';

function Workspace() {
  const navigate = useNavigate();
  const communication = useCommunication();
  const [docs, setDocs] = useState<Document[]>([]);
  const { showError } = useError();

  async function createDocument() {
    const { id } = await communication.http.post('/documents');
    navigate(`/documents/${id}`);
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
    getDocuments().catch(showError);
  }, [communication, showError]);

  return (
    <div className="workspace">
      <h2>Workspace</h2>
      <WorkspaceHeader onCreateDocument={() => createDocument().catch(showError)} />
      <ul>
        {docs.map(document => (
          <DocumentPreview
            key={document.id}
            document={document}
            onDeleteDocument={() => deleteDocument(document.id).catch(showError)}
          />
        ))}
      </ul>
    </div>
  );
}

export default Workspace;
