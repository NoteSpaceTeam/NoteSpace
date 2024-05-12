import useWorkspaces from '@ui/pages/workspace/hooks/useWorkspaces.ts';
import WorkspaceView from '@ui/pages/home/components/WorkspaceView.tsx';
import WorkspaceHeader from '@ui/pages/workspace/components/WorkspaceHeader.tsx';
import CreateWorkspaceDialog from '@ui/pages/home/components/CreateWorkspaceDialog.tsx';
import useError from '@domain/error/useError.ts';
import './Home.scss';
import '../workspace/Workspace.scss';

function Home() {
  const { workspaces, createWorkspace, updateWorkspace, deleteWorkspace } = useWorkspaces();
  const { publishError } = useError();

  return (
    <div className="home">
      <h2>Home</h2>
      <WorkspaceHeader>
        <CreateWorkspaceDialog onCreate={values => createWorkspace(values).catch(publishError)} />
      </WorkspaceHeader>
      <ul className="items">
        {workspaces.map(workspace => (
          <WorkspaceView
            key={workspace.id}
            workspace={workspace}
            onDelete={() => deleteWorkspace(workspace.id).catch(publishError)}
            onRename={name => updateWorkspace({ ...workspace, name }).catch(publishError)}
            onInvite={() => {}}
          />
        ))}
      </ul>
    </div>
  );
}

export default Home;
