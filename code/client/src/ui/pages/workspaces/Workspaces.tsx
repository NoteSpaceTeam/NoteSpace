import useWorkspaces from '@domain/workspaces/useWorkspaces';
import WorkspaceView from '@ui/pages/workspaces/components/WorkspaceView';
import CreateWorkspaceDialog from '@ui/pages/workspaces/components/CreateWorkspaceDialog';
import DataTable from '@ui/components/table/DataTable';
import { MdDelete } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { sortWorkspaces } from '@domain/workspaces/utils';
import { useCommunication } from '@/contexts/communication/useCommunication';
import './Workspaces.scss';

function Workspaces() {
  const { workspaces, operations } = useWorkspaces();
  const [selected, setSelected] = useState<string[]>([]);
  const [rows, setRows] = useState(workspaces);
  const { socket } = useCommunication();

  useEffect(() => {
    socket.connect();
    setRows(workspaces);
    return () => {
      socket.disconnect();
    };
  }, [socket, workspaces]);

  return (
    <div className="workspaces">
      <h2>Workspaces</h2>
      <DataTable
        columns={['Name', 'Members', 'Created', 'Privacy']}
        hasSelected={selected.length > 0}
        createButton={<CreateWorkspaceDialog onCreate={workspace => operations.createWorkspace(workspace)} />}
        deleteButton={
          <button
            onClick={() => {
              selected.forEach(workspace => operations.deleteWorkspace(workspace));
              setSelected([]);
            }}
          >
            <MdDelete />
          </button>
        }
        onSelectAll={value => setSelected(value ? workspaces.map(workspace => workspace.id) : [])}
        sortRows={(column, ascending) => {
          setRows(() => sortWorkspaces([...rows], column, ascending));
        }}
      >
        {rows.map(workspace => (
          <WorkspaceView
            key={workspace.id}
            workspace={workspace}
            selected={selected.includes(workspace.id)}
            onSelect={value =>
              setSelected(prev => (value ? [...prev, workspace.id] : prev.filter(id => id !== workspace.id)))
            }
            onDelete={() => operations.deleteWorkspace(workspace.id)}
            onRename={name => operations.updateWorkspace(workspace.id, { ...workspace, name })}
            onGetMembers={() => operations.getWorkspaceMembers(workspace.id)}
            onAddMember={email => operations.addWorkspaceMember(workspace.id, email)}
            onRemoveMember={email => operations.removeWorkspaceMember(workspace.id, email)}
          />
        ))}
      </DataTable>
    </div>
  );
}

export default Workspaces;
