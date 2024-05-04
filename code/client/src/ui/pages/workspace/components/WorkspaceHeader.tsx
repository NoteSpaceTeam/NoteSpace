import { FaFilter, FaPlus } from 'react-icons/fa';

type WorkspaceHeaderProps = {
  onCreateDocument: () => Promise<void>;
};

function WorkspaceHeader({ onCreateDocument }: WorkspaceHeaderProps) {
  return (
    <div className="header">
      <FaFilter />
      <button onClick={onCreateDocument}>
        <p>New</p>
        <FaPlus />
      </button>
    </div>
  );
}

export default WorkspaceHeader;
