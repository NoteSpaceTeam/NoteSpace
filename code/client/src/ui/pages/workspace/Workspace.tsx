import WorkspaceHeader from '@ui/pages/workspace/components/WorkspaceHeader';
import DocumentPreview from '@ui/pages/workspace/components/DocumentPreview';
import useError from '@domain/error/useError';
import useDocuments from '@ui/pages/workspace/hooks/useDocuments.ts';
import './Workspace.scss';
import { useEffect } from 'react';
import { useCommunication } from '@/services/communication/context/useCommunication.ts';
import { useParams } from 'react-router-dom';

function Workspace() {
  const { documents, createDocument, deleteDocument, updateDocument } = useDocuments();
  const { socket } = useCommunication();
  const { publishError } = useError();
  const { wid } = useParams();

  useEffect(() => {
    socket.emit('joinWorkspace', wid);
  }, [socket, wid]);

  return (
    <div className="workspace">
      <h2>Workspace</h2>
      <WorkspaceHeader onCreateNew={() => createDocument().catch(publishError)}></WorkspaceHeader>
      <ul className="items">
        {documents.map(document => (
          <DocumentPreview
            key={document.id}
            document={document}
            onDelete={() => deleteDocument(document.id).catch(publishError)}
            onDuplicate={() => createDocument(document.name).catch(publishError)}
            onRename={title => updateDocument(document.id, title).catch(publishError)}
          />
        ))}
      </ul>
    </div>
  );
}

export default Workspace;
