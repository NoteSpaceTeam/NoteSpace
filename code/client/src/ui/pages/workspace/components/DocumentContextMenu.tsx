import PopupMenu from '@ui/components/popup-menu/PopupMenu';
import { ReactNode } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { HiDuplicate } from 'react-icons/hi';

type DocumentContextMenuProps = {
  children: ReactNode;
  onRename: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
};

function DocumentContextMenu({ children, onRename, onDelete, onDuplicate }: DocumentContextMenuProps) {
  return (
    <PopupMenu item={children}>
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
    </PopupMenu>
  );
}

export default DocumentContextMenu;
