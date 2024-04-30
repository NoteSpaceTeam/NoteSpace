import SlateEditor from '@/ui/pages/editor/components/slate-editor/SlateEditor';
import './DocumentEditor.scss';
import useFugue from '@/domain/editor/hooks/useFugue';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCommunication } from '@/domain/communication/context/useContext';

function DocumentEditor() {
  const communication = useCommunication();
  const { http, socket } = communication;

  const fugue = useFugue();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchDocument() {
      const { nodes, title } = await http.get(`/documents/${id}`);
      fugue.init(nodes);
      setTitle(title);
      socket.connect();
      socket.emit('joinDocument', id);
      setLoaded(true);
    }
    fetchDocument();
    return () => {
      socket.emit('leaveDocument');
      socket.disconnect();
    };
  }, [fugue, id, http, socket]);

  return <div>{loaded && <SlateEditor title={title} fugue={fugue} communication={communication} />}</div>;
}

export default DocumentEditor;
