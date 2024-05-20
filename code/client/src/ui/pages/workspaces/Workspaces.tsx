import useWorkspaces from '@ui/pages/workspaces/hooks/useWorkspaces';
import WorkspaceView from '@ui/pages/workspaces/components/WorkspaceView';
import WorkspaceHeader from '@ui/pages/workspace/components/header/WorkspaceHeader';
import CreateWorkspaceDialog from '@ui/pages/workspaces/components/CreateWorkspaceDialog';
import useError from '@ui/contexts/error/useError';
import './Workspaces.scss';
import '../workspace/Workspace.scss';

function Workspaces() {
  const { workspaces, createWorkspace, updateWorkspace, deleteWorkspace } = useWorkspaces();
  const { publishError } = useError();

  return (
    <div className="home">
      <h2>Workspaces</h2>
      <WorkspaceHeader>
        <CreateWorkspaceDialog onCreate={workspace => createWorkspace(workspace).catch(publishError)} />
      </WorkspaceHeader>
      <ul className="items">
        {workspaces.map(workspace => (
          <WorkspaceView
            key={workspace.id}
            workspace={workspace}
            onDelete={() => deleteWorkspace(workspace.id).catch(publishError)}
            onRename={name => updateWorkspace(workspace.id, { ...workspace, name }).catch(publishError)}
            onInvite={() => {}}
          />
        ))}
      </ul>
    </div>
  );
}

export default Workspaces;
