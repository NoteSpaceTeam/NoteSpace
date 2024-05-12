import WorkspaceHeader from '@ui/pages/workspace/components/WorkspaceHeader';
import DocumentView from '@ui/pages/workspace/components/DocumentView.tsx';
import useError from '@domain/error/useError';
import useDocuments from '@ui/pages/workspace/hooks/useDocuments.ts';
import './Workspace.scss';
import useWorkspace from '@domain/workspace/useWorkspace.ts';

function Workspace() {
  const { workspace } = useWorkspace();
  const { documents, createDocument, deleteDocument, updateDocument } = useDocuments();
  const { publishError } = useError();

  return (
    <div className="workspace">
      <h2>Workspace {workspace?.name}</h2>
      <WorkspaceHeader onCreateNew={() => createDocument().catch(publishError)}></WorkspaceHeader>
      <ul className="items">
        {documents.map(document => (
          <DocumentView
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
