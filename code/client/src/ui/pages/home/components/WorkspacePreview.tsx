import { Link } from 'react-router-dom';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace.ts';
import useEditing from '@ui/hooks/useEditing.tsx';
import { RiComputerLine } from 'react-icons/ri';
import WorkspaceContextMenu from '@ui/pages/home/components/WorkspaceContextMenu.tsx';

type WorkspacePreviewProps = {
  workspace: WorkspaceMetaData;
  onDelete: () => void;
  onRename: (title: string) => void;
  onInvite: () => void;
};

function WorkspacePreview({ workspace, onDelete, onRename, onInvite }: WorkspacePreviewProps) {
  const { component, isEditing, setIsEditing } = useEditing(workspace.name, onRename);
  const WorkspaceView = (
    <li>
      <div>
        <RiComputerLine />
        {component}
      </div>
    </li>
  );
  return (
    <WorkspaceContextMenu
      item={isEditing ? WorkspaceView : <Link to={`/workspaces/${workspace.id}`}>{WorkspaceView}</Link>}
      onInvite={onInvite}
      onRename={() => setIsEditing(true)}
      onDelete={onDelete}
    />
  );
}

export default WorkspacePreview;
