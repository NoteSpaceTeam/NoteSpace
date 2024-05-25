import PopupMenu from '@ui/components/popup-menu/PopupMenu';
import { ReactNode } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { HiDuplicate, HiOutlineExternalLink } from 'react-icons/hi';

type ResourceContextMenuProps = {
  children: ReactNode;
  onRename: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onOpenInNewTab?: () => void;
};

function ResourceContextMenu({ children, onOpenInNewTab, onRename, onDelete, onDuplicate }: ResourceContextMenuProps) {
  return (
    <PopupMenu item={children}>
      {onOpenInNewTab && (
        <button onClick={onOpenInNewTab}>
          <HiOutlineExternalLink />
          Open
        </button>
      )}
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

export default ResourceContextMenu;
