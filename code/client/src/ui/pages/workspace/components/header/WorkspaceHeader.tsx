import { MdOutlineNotes } from 'react-icons/md';
import './WorkspaceHeader.scss';
import { ReactNode } from 'react';
import { FaPlus } from 'react-icons/fa';

type WorkspaceHeaderProps = {
  onCreateNew?: () => Promise<void>;
  children?: ReactNode;
};

function WorkspaceHeader({ onCreateNew, children }: WorkspaceHeaderProps) {
  return (
    <div className="header">
      <MdOutlineNotes />
      <>
        {children || (
          <button onClick={onCreateNew}>
            <p>New</p>
            <FaPlus />
          </button>
        )}
      </>
    </div>
  );
}

export default WorkspaceHeader;
