import { Link, useParams } from 'react-router-dom';
import { FaFile } from 'react-icons/fa6';
import FileContextMenu from '@ui/pages/workspace/components/FileContextMenu';
import useEditing from '@ui/hooks/useEditing';
import { DocumentResourceMetadata } from '@notespace/shared/src/workspace/types/resource';

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
        <FaFile />
        {component}
      </div>
    </li>
  );
  return (
    <FileContextMenu onRename={() => setIsEditing(true)} onDuplicate={onDuplicate} onDelete={onDelete}>
      {isEditing ? DocumentComponent : <Link to={`/workspaces/${wid}/${document.id}`}>{DocumentComponent}</Link>}
    </FileContextMenu>
  );
}

export default FileView;
