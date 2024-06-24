import { Link } from 'react-router-dom';
import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { useEffect, useState } from 'react';
import useWorkspaceService from '@services/workspace/useWorkspaceService';
import useLoading from '@ui/hooks/useLoading';
import './Home.scss';

function Home() {
  const [workspaces, setWorkspaces] = useState<WorkspaceMeta[]>([]);
  const service = useWorkspaceService();
  const { loading, startLoading, stopLoading, spinner } = useLoading();

  useEffect(() => {
    async function getWorkspaces() {
      startLoading();
      const workspaces = await service.getWorkspacesFeed();
      setWorkspaces(workspaces);
      stopLoading();
    }
    getWorkspaces();
  }, [service, startLoading, stopLoading]);

  return (
    <div className="home">
      <h2>Home</h2>
      <p>Welcome to NoteSpace</p>
      <Link to="/workspaces">Go to Workspaces</Link>
      <br />
      <hr />
      <br />
      <h2>Public Workspaces</h2>
      {loading
        ? spinner
        : workspaces.map(workspace => (
            <div className="workspace">
              <Link key={workspace.id} to={`/workspaces/${workspace.id}`}>
                {workspace.name}
              </Link>
            </div>
          ))}
    </div>
  );
}

export default Home;
