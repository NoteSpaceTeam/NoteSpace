import PopupMenu from '@ui/components/popup-menu/PopupMenu';
import { ReactNode } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useAuth } from '@/contexts/auth/useAuth';
import ManageWorkspaceDialog from '@ui/pages/workspace/components/ManageWorkspaceDialog';
import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';

type WorkspaceContextMenuProps = {
  workspace: WorkspaceMeta;
  children: ReactNode;
  onRename: () => void;
  onDelete: () => void;
  onAddMember: (email: string) => Promise<void>;
  onRemoveMember: (email: string) => Promise<void>;
  toggleVisibility: () => Promise<void>;
};

function WorkspaceContextMenu({
  workspace,
  children,
  onRename,
  onDelete,
  onAddMember,
  onRemoveMember,
  toggleVisibility,
}: WorkspaceContextMenuProps) {
  const { currentUser } = useAuth();
  const isMember = workspace.members.includes(currentUser?.email || '');
  return (
    <PopupMenu item={children} enabled={isMember}>
      <button onClick={onRename}>
        <MdEdit />
        Rename
      </button>
      <ManageWorkspaceDialog
        workspace={workspace}
        onAddMember={onAddMember}
        onRemoveMember={onRemoveMember}
        toggleVisibility={toggleVisibility}
      />
      <button onClick={onDelete}>
        <MdDelete />
        Delete
      </button>
    </PopupMenu>
  );
}

export default WorkspaceContextMenu;
