import Editor from '@ui/pages/document/components/editor/Editor';
import useFugue from '@domain/editor/crdt/useFugue';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommunication } from '@/services/communication/context/useCommunication';
import useError from '@domain/error/useError';
import './Document.scss';
import useDocumentService from '@/services/document/useDocumentService.ts';

function Document() {
  const communication = useCommunication();
  const services = useDocumentService();
  const fugue = useFugue();
  const { publishError } = useError();
  const { id } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState('');
  const { http, socket } = communication;
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(false); // reset state to load new document (useful for when navigating between documents)

    async function fetchDocument() {
      if (!id) return;
      const { content, name } = await services.getDocument(id);
      setTitle(name);
      fugue.applyOperations(content, true);
      socket.emit('joinDocument', id);
      setLoaded(true);
    }
    fetchDocument().catch(e => {
      publishError(e);
      navigate('/');
    });
    return () => {
      socket.emit('leaveDocument');
    };
  }, [fugue, id, http, socket, publishError, services, setTitle, navigate]);

  if (!loaded) return null;

  return <Editor title={title} fugue={fugue} communication={communication} />;
}

export default Document;
