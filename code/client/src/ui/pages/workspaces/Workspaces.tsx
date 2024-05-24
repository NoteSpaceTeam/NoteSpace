import useWorkspaces from '@ui/pages/workspaces/hooks/useWorkspaces';
import WorkspaceView from '@ui/pages/workspaces/components/WorkspaceView';
import CreateWorkspaceDialog from '@ui/pages/workspaces/components/CreateWorkspaceDialog';
import useError from '@ui/contexts/error/useError';
import DataTable from '@ui/components/table/DataTable';
import { MdDelete } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { sortWorkspaces } from '@domain/workspaces/utils';
import './Workspaces.scss';

function Workspaces() {
  const { workspaces, operations } = useWorkspaces();
  const { publishError } = useError();
  const [selectedAll, setSelectedAll] = useState(false);
  const [rows, setRows] = useState(workspaces);

  useEffect(() => {
    setRows(workspaces);
  }, [workspaces]);

  return (
    <div className="workspaces">
      <h2>Workspaces</h2>
      <DataTable
        columns={['Name', 'Members', 'Created', 'Privacy']}
        createButton={
          <CreateWorkspaceDialog onCreate={workspace => operations.createWorkspace(workspace).catch(publishError)} />
        }
        deleteButton={
          <button
            onClick={() => {
              /* TODO */
            }}
          >
            <MdDelete />
          </button>
        }
        selectedAll={selectedAll}
        setSelectedAll={setSelectedAll}
        sortRows={(column, ascending) => {
          setRows(() => sortWorkspaces([...rows], column, ascending));
        }}
      >
        {rows.map(workspace => (
          <WorkspaceView
            key={workspace.id}
            workspace={workspace}
            selected={selectedAll}
            onDelete={() => operations.deleteWorkspace(workspace.id).catch(publishError)}
            onRename={name => operations.updateWorkspace(workspace.id, { ...workspace, name }).catch(publishError)}
            onInvite={() => {}}
          />
        ))}
      </DataTable>
    </div>
  );
}

export default Workspaces;
