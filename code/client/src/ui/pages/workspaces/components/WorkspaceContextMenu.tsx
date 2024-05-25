import PopupMenu from '@ui/components/popup-menu/PopupMenu';
import { ReactNode } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { RiShareBoxLine } from 'react-icons/ri';

type WorkspaceContextMenuProps = {
  children: ReactNode;
  onInvite: () => void;
  onRename: () => void;
  onDelete: () => void;
};

function WorkspaceContextMenu({ children, onInvite, onRename, onDelete }: WorkspaceContextMenuProps) {
  return (
    <PopupMenu item={children}>
      <button onClick={onRename}>
        <MdEdit />
        Rename
      </button>
      <button onClick={onInvite}>
        <RiShareBoxLine />
        Invite
      </button>
      <button onClick={onDelete}>
        <MdDelete />
        Delete
      </button>
    </PopupMenu>
  );
}

export default WorkspaceContextMenu;
