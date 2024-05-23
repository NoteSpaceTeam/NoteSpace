import useWorkspaces from '@ui/pages/workspaces/hooks/useWorkspaces';
import WorkspaceView from '@ui/pages/workspaces/components/WorkspaceView';
import CreateWorkspaceDialog from '@ui/pages/workspaces/components/CreateWorkspaceDialog';
import useError from '@ui/contexts/error/useError';
import { MdDelete } from 'react-icons/md';
import { useState } from 'react';
import { Checkbox } from '@mui/material';
import './Workspaces.scss';

function Workspaces() {
  const { workspaces, createWorkspace, updateWorkspace, deleteWorkspace } = useWorkspaces();
  const { publishError } = useError();
  const [selectedAll, setSelectedAll] = useState(false);

  return (
    <div className="workspaces">
      <h2>Workspaces</h2>

      <div className="container">
        {selectedAll ? (
          <button>
            <MdDelete />
          </button>
        ) : (
          <CreateWorkspaceDialog onCreate={workspace => createWorkspace(workspace).catch(publishError)} />
        )}
        <div className="table">
          <div className="table-row">
            <Checkbox checked={selectedAll} onChange={() => setSelectedAll(!selectedAll)} />
            <p>Name</p>
            <p>Members</p>
            <p>Created</p>
            <p>Visibility</p>
          </div>

          {workspaces.map(workspace => (
            <WorkspaceView
              key={workspace.id}
              workspace={workspace}
              selected={selectedAll}
              onDelete={() => deleteWorkspace(workspace.id).catch(publishError)}
              onRename={name => updateWorkspace(workspace.id, { ...workspace, name }).catch(publishError)}
              onInvite={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Workspaces;
