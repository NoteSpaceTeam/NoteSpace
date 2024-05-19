import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { BsFileEarmarkPlusFill } from 'react-icons/bs';
import { MdCreateNewFolder } from 'react-icons/md';

type CreateResourcePopupProps = {
  position: { top: number; left: number };
  onCreate: (type: ResourceType) => void;
};

function CreateResourcePopup({ position, onCreate }: CreateResourcePopupProps) {
  return (
    <div
      className="popup"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <button onClick={() => onCreate(ResourceType.FOLDER)}>
        <MdCreateNewFolder />
        Folder
      </button>
      <button onClick={() => onCreate(ResourceType.DOCUMENT)}>
        <BsFileEarmarkPlusFill />
        Document
      </button>
    </div>
  );
}

export default CreateResourcePopup;
