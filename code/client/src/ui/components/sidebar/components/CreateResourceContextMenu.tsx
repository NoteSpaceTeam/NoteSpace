import ContextMenu from '@ui/components/context-menu/ContextMenu';
import { ReactNode } from 'react';
import { MdCreateNewFolder } from 'react-icons/md';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { BsFileEarmarkPlusFill } from 'react-icons/bs';

type CreateResourceContextMenuProps = {
  onCreateNew: (type: ResourceType) => void;
  trigger: string;
  children: ReactNode;
};

function CreateResourceContextMenu({ children, onCreateNew, trigger }: CreateResourceContextMenuProps) {
  return (
    <ContextMenu item={children} trigger={trigger}>
      <button onClick={() => onCreateNew(ResourceType.FOLDER)}>
        <MdCreateNewFolder />
        Folder
      </button>
      <button onClick={() => onCreateNew(ResourceType.DOCUMENT)}>
        <BsFileEarmarkPlusFill />
        Document
      </button>
    </ContextMenu>
  );
}

export default CreateResourceContextMenu;