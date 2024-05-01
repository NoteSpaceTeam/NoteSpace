import Editor from '@/ui/pages/document/components/editor/Editor';
import useFugue from '@/domain/editor/hooks/useFugue';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCommunication } from '@/domain/communication/context/useCommunication';
import { useErrorBoundary } from 'react-error-boundary';
import useDocumentServices from '@/domain/editor/services/useDocumentServices';
import './Document.scss';

function Document() {
  const communication = useCommunication();
  const services = useDocumentServices(communication.http);
  const { http, socket } = communication;
  const fugue = useFugue();
  const { showBoundary } = useErrorBoundary();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDocument() {
      if (!id) return;
      const { nodes, title } = await services.getDocument(id);
      fugue.init(nodes);
      setTitle(title);
      socket.connect();
      socket.emit('joinDocument', id);
      setLoaded(true);
    }
    fetchDocument().catch(showBoundary);
    return () => {
      socket.emit('leaveDocument');
      socket.disconnect();
    };
  }, [fugue, id, http, socket, showBoundary, services, navigate]);

  return <div>{loaded && <Editor title={title} fugue={fugue} communication={communication} />}</div>;
}

export default Document;
