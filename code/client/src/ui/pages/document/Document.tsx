import Editor from '@ui/pages/document/components/editor/Editor';
import useFugue from '@domain/editor/fugue/useFugue';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommunication } from '@/contexts/communication/useCommunication';
import useError from '@/contexts/error/useError';
import useDocumentService from '@services/resource/useResourceService';
import useConnectors from '@domain/editor/connectors/useConnectors';
import { DocumentResource } from '@notespace/shared/src/workspace/types/resource';
import './Document.scss';

function Document() {
  const communication = useCommunication();
  const { http, socket } = communication;
  const services = useDocumentService();
  const fugue = useFugue();
  const { publishError } = useError();
  const { wid, id } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState('');
  const connectors = useConnectors(fugue, communication);
  const navigate = useNavigate();

  // redirect to workspace if document is deleted
  connectors.service.on('deletedResource', rid => {
    if (id === rid) {
      navigate(`/workspaces/${wid}`);
      publishError(Error('Document was deleted'));
    }
  });

  useEffect(() => {
    setLoaded(false); // reset state to load new document (for when navigating between documents)

    async function fetchDocument() {
      if (!id) return;
      const resource = await services.getResource(id);
      const { name, content } = resource as DocumentResource;
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
  return <Editor title={title} fugue={fugue} connectors={connectors} />;
}

export default Document;
