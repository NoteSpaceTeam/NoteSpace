import PopupMenu from '@ui/components/popup-menu/PopupMenu';
import { MdCreateNewFolder } from 'react-icons/md';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { BsFileEarmarkPlusFill } from 'react-icons/bs';

type CreateResourceMenuProps = {
  onCreateNew: (type: ResourceType) => void;
  trigger: string;
  enabled?: boolean;
};

function CreateResourceMenu({ onCreateNew, trigger, enabled }: CreateResourceMenuProps) {
  return (
    <PopupMenu item={<></>} trigger={trigger} enabled={enabled}>
      <button onClick={() => onCreateNew(ResourceType.DOCUMENT)}>
        <BsFileEarmarkPlusFill />
        Document
      </button>
      <button onClick={() => onCreateNew(ResourceType.FOLDER)}>
        <MdCreateNewFolder />
        Folder
      </button>
    </PopupMenu>
  );
}

export default CreateResourceMenu;
