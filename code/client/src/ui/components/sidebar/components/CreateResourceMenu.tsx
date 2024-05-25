import PopupMenu from '@ui/components/popup-menu/PopupMenu';
import { MdCreateNewFolder } from 'react-icons/md';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { BsFileEarmarkPlusFill } from 'react-icons/bs';

type CreateResourceMenuProps = {
  onCreateNew: (type: ResourceType) => void;
  trigger: string;
};

function CreateResourceMenu({ onCreateNew, trigger }: CreateResourceMenuProps) {
  return (
    <PopupMenu item={<></>} trigger={trigger}>
      <button onClick={() => onCreateNew(ResourceType.FOLDER)}>
        <MdCreateNewFolder />
        Folder
      </button>
      <button onClick={() => onCreateNew(ResourceType.DOCUMENT)}>
        <BsFileEarmarkPlusFill />
        Document
      </button>
    </PopupMenu>
  );
}

export default CreateResourceMenu;
