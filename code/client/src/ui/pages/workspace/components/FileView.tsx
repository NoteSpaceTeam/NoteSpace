import { IoDocumentText } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';
import FileContextMenu from '@ui/pages/workspace/components/FileContextMenu.tsx';
import { DocumentResourceMetadata } from '@notespace/shared/src/workspace/types/resource.ts';
import useEditing from '@ui/hooks/useEditing.tsx';

type DocumentPreviewProps = {
  document: DocumentResourceMetadata;
  onDelete: () => void;
  onDuplicate: () => void;
  onRename: (title: string) => void;
};

function FileView({ document, onDelete, onRename, onDuplicate }: DocumentPreviewProps) {
  const { wid } = useParams();
  const { component, isEditing, setIsEditing } = useEditing(document.name || 'Untitled', onRename);
  const DocumentComponent = (
    <li>
      <div>
        <IoDocumentText />
        {component}
      </div>
    </li>
  );
  return (
    <FileContextMenu
      item={isEditing ? DocumentComponent : <Link to={`/workspaces/${wid}/${document.id}`}>{DocumentComponent}</Link>}
      onRename={() => setIsEditing(true)}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
    />
  );
}

export default FileView;
