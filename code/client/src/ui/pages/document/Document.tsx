import Editor from '@ui/pages/document/components/editor/Editor';
import useFugue from '@domain/editor/crdt/useFugue';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommunication } from '@/services/communication/context/useCommunication';
import useDocumentServices from '@/services/useDocumentServices';
import useError from '@domain/error/useError';
import useWorkspace from '@domain/workspace/useWorkspace';
import './Document.scss';

function Document() {
  const communication = useCommunication();
  const services = useDocumentServices();
  const { http, socket } = communication;
  const fugue = useFugue();
  const { publishError } = useError();
  const { wid, id } = useParams();
  const [title, setTitle] = useState('');
  const [loaded, setLoaded] = useState(false);
  const { setFilePath } = useWorkspace();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDocument() {
      if (!id) return;
      const { content, name } = await services.getDocument(id);
      fugue.applyOperations(content, true);
      setTitle(name);
      setLoaded(true);
      setFilePath(`/documents/${title || 'Untitled'}`);
      socket.emit('joinWorkspace', wid);
      socket.emit('joinDocument', id);
    }
    console.log('fetching document');
    fetchDocument().catch(e => {
      publishError(e);
      // navigate('/');
    });
    return () => {
      socket.emit('leaveDocument');
    };
  }, [fugue, id, http, socket, publishError, services, setFilePath, navigate, title, wid]);

  return <div>{loaded && <Editor title={title} fugue={fugue} communication={communication} />}</div>;
}

export default Document;
