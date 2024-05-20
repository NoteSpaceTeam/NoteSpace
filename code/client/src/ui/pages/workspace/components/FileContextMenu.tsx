import ContextMenu from '@ui/components/context-menu/ContextMenu';
import { ReactNode } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { HiDuplicate } from 'react-icons/hi';

type DocumentContextMenuProps = {
  children: ReactNode;
  onRename: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
};

function FileContextMenu({ children, onRename, onDelete, onDuplicate }: DocumentContextMenuProps) {
  return (
    <ContextMenu item={children}>
      <button onClick={onRename}>
        <MdEdit />
        Rename
      </button>
      <button onClick={onDuplicate}>
        <HiDuplicate />
        Duplicate
      </button>
      <button onClick={onDelete}>
        <MdDelete />
        Delete
      </button>
    </ContextMenu>
  );
}

export default FileContextMenu;
