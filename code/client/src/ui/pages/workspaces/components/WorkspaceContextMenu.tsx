import PopupMenu from '@ui/components/popup-menu/PopupMenu';
import { ReactNode, useEffect, useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import ManageMembersDialog from '@ui/pages/workspace/components/ManageMembersDialog';
import { UserData } from '@notespace/shared/src/users/types';

type WorkspaceContextMenuProps = {
  children: ReactNode;
  onRename: () => void;
  onDelete: () => void;
  onGetMembers: () => Promise<UserData[]>;
  onAddMember: (email: string) => Promise<void>;
  onRemoveMember: (email: string) => Promise<void>;
};

function WorkspaceContextMenu({
  children,
  onRename,
  onDelete,
  onGetMembers,
  onAddMember,
  onRemoveMember,
}: WorkspaceContextMenuProps) {
  const [members, setMembers] = useState<UserData[]>([]);

  useEffect(() => {
    onGetMembers().then(setMembers);
  }, [onGetMembers]);

  return (
    <PopupMenu item={children}>
      <button onClick={onRename}>
        <MdEdit />
        Rename
      </button>
      <ManageMembersDialog members={members} onAddMember={onAddMember} onRemoveMember={onRemoveMember} />
      <button onClick={onDelete}>
        <MdDelete />
        Delete
      </button>
    </PopupMenu>
  );
}

export default WorkspaceContextMenu;
