import SlateEditor from '@pages/editor/slate/SlateEditor.tsx';
import './DocumentEditor.scss';
import useFugue from '@pages/editor/hooks/useFugue.ts';
import {useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import {CommunicationContext} from "@/contexts/CommunicationContext.tsx";

function DocumentEditor() {
  const communication = useContext(CommunicationContext);
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

  return (
    <div>
      {loaded && <SlateEditor title={title} fugue={fugue} communication={communication} />}
    </div>
  )
}

export default DocumentEditor;
