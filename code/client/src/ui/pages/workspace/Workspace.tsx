import { useCommunication } from '@/services/communication/context/useCommunication';
import WorkspaceHeader from '@ui/pages/workspace/components/WorkspaceHeader';
import DocumentPreview from '@ui/pages/workspace/components/DocumentPreview';
import useError from '@domain/error/useError';
import useDocuments from '@ui/pages/workspace/hooks/useDocuments.ts';
import './Workspace.scss';

function Workspace() {
  const communication = useCommunication();
  const { documents, createDocument, deleteDocument, updateDocument } = useDocuments(communication);
  const { showError } = useError();

  return (
    <div className="workspace">
      <h2>Workspace</h2>
      <WorkspaceHeader onCreateDocument={() => createDocument().catch(showError)} />
      <ul>
        {documents.map(document => (
          <DocumentPreview
            key={document.id}
            doc={document}
            onDelete={() => deleteDocument(document.id).catch(showError)}
            onDuplicate={() => createDocument(document.name).catch(showError)}
            onRename={title => updateDocument(document.id, title).catch(showError)}
          />
        ))}
      </ul>
    </div>
  );
}

export default Workspace;
