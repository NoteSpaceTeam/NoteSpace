import { useEffect, useState } from 'react';
import { useCommunication } from '@/domain/communication/context/useCommunication';
import { Link, useNavigate } from 'react-router-dom';
import { Document } from '@notespace/shared/crdt/types/document';
import { MdDelete } from 'react-icons/md';
import { IoDocumentText } from 'react-icons/io5';
import { FaFilter, FaPlus } from 'react-icons/fa';
import './Home.scss';

function Home() {
  const navigate = useNavigate();
  const communication = useCommunication();
  const [docs, setDocs] = useState<Document[]>([]);

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
    getDocuments();
  }, [communication]);

  return (
    <div className="home">
      <h2>Documents</h2>
      <div className="header">
        <FaFilter />
        <button onClick={createDocument}>
          <p>New</p>
          <FaPlus />
        </button>
      </div>
      <ul>
        {docs.map(doc => (
          <li key={doc.id}>
            <div>
              <IoDocumentText />
              <Link to={`/documents/${doc.id}`} className="doc-title">
                {doc.title || 'Untitled'}
              </Link>
            </div>
            <button onClick={() => onDeleteDocument(doc.id)}>
              <MdDelete />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
