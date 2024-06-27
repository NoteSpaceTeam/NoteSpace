import PopupMenu from '@ui/components/popup-menu/PopupMenu';
import { ReactNode, useEffect, useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useAuth } from '@/contexts/auth/useAuth';
import ManageWorkspaceDialog from '@ui/pages/workspace/components/ManageWorkspaceDialog';

type WorkspaceContextMenuProps = {
  children: ReactNode;
  onRename: () => void;
  onDelete: () => void;
  onGetMembers: () => Promise<string[]>;
  onAddMember: (email: string) => Promise<void>;
  onRemoveMember: (email: string) => Promise<void>;
  isPrivate: boolean;
  toggleVisibility: () => Promise<void>;
};

function WorkspaceContextMenu({
  children,
  onRename,
  onDelete,
  onGetMembers,
  onAddMember,
  onRemoveMember,
  isPrivate,
  toggleVisibility,
}: WorkspaceContextMenuProps) {
  const [members, setMembers] = useState<string[]>([]);
  const [isMember, setIsMember] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchMembers() {
      const members = await onGetMembers();
      setMembers(members);
      setIsMember(members.includes(currentUser?.email || ''));
    }
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <PopupMenu item={children} enabled={isMember}>
      <button onClick={onRename}>
        <MdEdit />
        Rename
      </button>
      <ManageWorkspaceDialog
        members={members}
        onAddMember={onAddMember}
        onRemoveMember={onRemoveMember}
        isPrivate={isPrivate}
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
