import Editor from '@ui/pages/document/components/editor/Editor';
import useFugue from '@domain/editor/fugue/useFugue';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommunication } from '@/contexts/communication/useCommunication';
import useError from '@/contexts/error/useError';
import useDocumentService from '@services/resource/useResourcesService';
import useConnectors from '@domain/editor/connectors/useConnectors';
import FloatingButtons from '@ui/pages/document/components/floating-buttons/FloatingButtons';
import { DocumentResource } from '@notespace/shared/src/workspace/types/resource';
import './Document.scss';

function Document() {
  const communication = useCommunication();
  const { socket } = communication;
  const services = useDocumentService();
  const fugue = useFugue();
  const { publishError } = useError();
  const { wid, id } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState('');
  const connectors = useConnectors(fugue, communication);
  const navigate = useNavigate();

  // redirect to workspace page if document is deleted
  connectors.service.on('deletedResource', rid => {
    if (id === rid) {
      publishError(Error('Document was deleted'));
      navigate(`/workspaces/${wid}`);
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
    fetchDocument();
    return () => {
      socket.emit('leaveDocument');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!loaded) return null;
  return (
    <div className="document">
      <Editor title={title} fugue={fugue} connectors={connectors} />
      <FloatingButtons />
    </div>
  );
}

export default Document;
