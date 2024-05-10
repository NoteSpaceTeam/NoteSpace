import Editor from '@ui/pages/document/components/editor/Editor';
import useFugue from '@domain/editor/crdt/useFugue';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommunication } from '@/services/communication/context/useCommunication';
import useDocumentServices from '@/services/useDocumentServices';
import './Document.scss';
import useError from '@domain/error/useError';
import useWorkspace from '@domain/workspace/useWorkspace';

function Document() {
  const communication = useCommunication();
  const services = useDocumentServices(communication.http);
  const { http, socket } = communication;
  const fugue = useFugue();
  const { showError } = useError();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [loaded, setLoaded] = useState(false);
  const { setFilePath } = useWorkspace();
  const navigate = useNavigate();

  // useEffect(() => {
  //   socket.connect('/document');
  //   return () => {
  //     socket.disconnect('/document');
  //   };
  // }, [socket]);

  useEffect(() => {
    async function fetchDocument() {
      if (!id) return;
      const { content, name } = await services.getDocument(id);
      fugue.applyOperations(content, true);
      setTitle(name);
      setLoaded(true);
      setFilePath(`/documents/${title || 'Untitled'}`);
      socket.emit('document:join', id);
    }
    fetchDocument().catch(e => {
      showError(e);
      navigate('/');
    });
    return () => {
      socket.emit('document:leave');
    };
  }, [fugue, id, http, socket, showError, services, setFilePath, navigate, title]);

  return <div>{loaded && <Editor title={title} fugue={fugue} communication={communication} />}</div>;
}

export default Document;
