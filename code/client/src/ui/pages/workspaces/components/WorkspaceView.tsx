import { Link } from 'react-router-dom';
import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import useEditing from '@ui/hooks/useEditing';
import WorkspaceContextMenu from '@ui/pages/workspaces/components/WorkspaceContextMenu';
import { Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import { formatDate } from '@/utils/utils';

type WorkspacePreviewProps = {
  workspace: WorkspaceMeta;
  selected: boolean;
  onSelect: (value: boolean) => void;
  onDelete: () => void;
  onRename: (title: string) => void;
  onInvite: () => void;
};

function WorkspaceView({ workspace, selected, onSelect, onDelete, onRename, onInvite }: WorkspacePreviewProps) {
  const { component, isEditing, setIsEditing } = useEditing(workspace.name, onRename);
  const [isSelected, setSelected] = useState(selected);

  useEffect(() => {
    setSelected(selected);
  }, [selected]);

  function onCheckboxSelected() {
    setSelected(!isSelected);
    onSelect(!isSelected);
  }

  const WorkspaceComponent = (
    <div className="table-row">
      <Checkbox checked={isSelected} onChange={onCheckboxSelected} onClick={e => e.stopPropagation()} />
      {component}
      <p>{workspace.members.length}</p>
      <p>{formatDate(workspace.createdAt)}</p>
      <p>{workspace.isPrivate ? 'Private' : 'Public'}</p>
    </div>
  );
  return isEditing ? (
    WorkspaceComponent
  ) : (
    <WorkspaceContextMenu onInvite={onInvite} onRename={() => setIsEditing(true)} onDelete={onDelete}>
      <Link to={`/workspaces/${workspace.id}`}>{WorkspaceComponent}</Link>
    </WorkspaceContextMenu>
  );
}

export default WorkspaceView;
