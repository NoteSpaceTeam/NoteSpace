import Editor from '@ui/pages/document/components/editor/Editor';
import useFugue from '@domain/editor/fugue/useFugue';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommunication } from '@ui/contexts/communication/useCommunication';
import useError from '@ui/contexts/error/useError';
import useDocumentService from '@services/resource/useResourceService';
import useConnectors from '@domain/editor/connectors/hook';
import { DocumentResource } from '@notespace/shared/src/workspace/types/resource';
import './Document.scss';

function Document() {
  const communication = useCommunication();
  const services = useDocumentService();
  const fugue = useFugue();

  const { publishError } = useError();
  const { id } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState('');

  const connectors = useConnectors(fugue, communication);

  const { http, socket } = communication;
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(false); // reset state to load new document (for when navigating between documents)

    async function fetchDocument() {
      if (!id) return;
      const { content, name } = (await services.getResource(id)) as DocumentResource;
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

  useEffect(() => {
    console.log(fugue);
  }, [fugue]);

  useEffect(() => {
    console.log('Loading document');
  }, []);

  if (!loaded) return null;

  return <Editor title={title} fugue={fugue} connectors={connectors} />;
}

export default Document;
