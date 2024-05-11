import ContextMenu from '@ui/components/context-menu/ContextMenu';
import { ReactNode } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { RiShareBoxLine } from 'react-icons/ri';

type WorkspaceContextMenuProps = {
  item: ReactNode;
  onInvite: () => void;
  onRename: () => void;
  onDelete: () => void;
};

function WorkspaceContextMenu({ item, onInvite, onRename, onDelete }: WorkspaceContextMenuProps) {
  return (
    <ContextMenu item={item}>
      <button onClick={onInvite}>
        <RiShareBoxLine />
        Invite
      </button>
      <button onClick={onRename}>
        <MdEdit />
        Rename
      </button>
      <button onClick={onDelete}>
        <MdDelete />
        Delete
      </button>
    </ContextMenu>
  );
}

export default WorkspaceContextMenu;