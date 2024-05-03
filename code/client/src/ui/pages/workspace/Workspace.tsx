import { useEffect, useState } from 'react';
import { useCommunication } from '@/domain/communication/context/useCommunication';
import { Link, useNavigate } from 'react-router-dom';
import { Document } from '@notespace/shared/crdt/types/document';
import { MdDelete } from 'react-icons/md';
import { IoDocumentText } from 'react-icons/io5';
import { FaFilter, FaPlus } from 'react-icons/fa';
import './Workspace.scss';
import { useErrorBoundary } from 'react-error-boundary';

function Workspace() {
  const navigate = useNavigate();
  const communication = useCommunication();
  const [docs, setDocs] = useState<Document[]>([]);
  const { showBoundary } = useErrorBoundary();

  async function createDocument() {
    const { id } = await communication.http.post('/documents');
    navigate(`/documents/${id}`);
  }

  async function onDeleteDocument(id: string) {
    await communication.http.delete(`/documents/${id}`);
    setDocs(docs.filter(doc => doc.id !== id));
  }

  useEffect(() => {
    async function getDocuments() {
      const documents = await communication.http.get('/documents');
      setDocs(documents);
    }
    getDocuments().catch(showBoundary);
  }, [communication, showBoundary]);

  return (
    <div className="workspace">
      <h2>Workspace</h2>
      <div className="header">
        <FaFilter />
        <button onClick={() => createDocument().catch(showBoundary)}>
          <p>New</p>
          <FaPlus />
        </button>
      </div>
      <ul>
        {docs.map(doc => (
          <Link to={`/documents/${doc.id}`} className="doc-title" key={doc.id}>
            <li>
              <div>
                <IoDocumentText />
                {doc.title || 'Untitled'}
              </div>
              <button
                onClick={e => {
                  e.preventDefault();
                  onDeleteDocument(doc.id).catch(showBoundary);
                }}
              >
                <MdDelete />
              </button>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default Workspace;
