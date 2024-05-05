import { FaPlus } from 'react-icons/fa';
import { MdOutlineNotes } from 'react-icons/md';

type WorkspaceHeaderProps = {
  onCreateDocument: () => Promise<void>;
};

function WorkspaceHeader({ onCreateDocument }: WorkspaceHeaderProps) {
  return (
    <div className="header">
      <MdOutlineNotes />
      <button onClick={onCreateDocument}>
        <p>New</p>
        <FaPlus />
      </button>
    </div>
  );
}

export default WorkspaceHeader;
