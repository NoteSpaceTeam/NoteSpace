import PopupMenu from '@ui/components/popup-menu/PopupMenu';
import { ReactNode, useEffect, useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import ManageMembersDialog from '@ui/pages/workspace/components/ManageMembersDialog';
import { useAuth } from '@/contexts/auth/useAuth';

type WorkspaceContextMenuProps = {
  children: ReactNode;
  onRename: () => void;
  onDelete: () => void;
  onGetMembers: () => Promise<string[]>;
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
      <ManageMembersDialog members={members} onAddMember={onAddMember} onRemoveMember={onRemoveMember} />
      <button onClick={onDelete}>
        <MdDelete />
        Delete
      </button>
    </PopupMenu>
  );
}

export default WorkspaceContextMenu;
