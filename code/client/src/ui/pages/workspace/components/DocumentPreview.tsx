import { IoDocumentText } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';
import DocumentContextMenu from '@ui/pages/workspace/components/DocumentContextMenu';
import { DocumentResourceMetadata } from '@notespace/shared/src/workspace/types/resource.ts';
import useEditing from '@ui/hooks/useEditing.tsx';

type DocumentPreviewProps = {
  document: DocumentResourceMetadata;
  onDelete: () => void;
  onDuplicate: () => void;
  onRename: (title: string) => void;
};

function DocumentPreview({ document, onDelete, onRename, onDuplicate }: DocumentPreviewProps) {
  const { wid } = useParams();
  const { component, isEditing, setIsEditing } = useEditing(document.name || 'Untitled', onRename);
  const DocumentView = (
    <li>
      <div>
        <IoDocumentText />
        {component}
      </div>
    </li>
  );
  return (
    <DocumentContextMenu
      item={isEditing ? DocumentView : <Link to={`/workspaces/${wid}/documents/${document.id}`}>{DocumentView}</Link>}
      onRename={() => setIsEditing(true)}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
    />
  );
}

export default DocumentPreview;
