import WorkspaceHeader from '@ui/pages/workspace/components/WorkspaceHeader';
import DocumentPreview from '@ui/pages/workspace/components/DocumentPreview';
import useError from '@domain/error/useError';
import useDocuments from '@ui/pages/workspace/hooks/useDocuments.ts';
import './Workspace.scss';

function Workspace() {
  const documents = [
    { id: '1', name: 'Document 1' },
    { id: '2', name: 'Document 2' },
    { id: '3', name: 'Document 3' },
  ];
  const { createDocument, deleteDocument, updateDocument } = useDocuments();
  const { publishError } = useError();
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
