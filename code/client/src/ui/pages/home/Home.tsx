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
      const workspaces = await service.getWorkspaces();
      setWorkspaces(workspaces);
      stopLoading();
    }
    getWorkspaces();
  }, [service, startLoading, stopLoading]);

  return (
    <div className="home">
      <h2>Home</h2>
      {loading ? (
        spinner
      ) : workspaces.length > 0 ? (
        workspaces.map(workspace => (
          <div className="workspace" key={workspace.id}>
            <Link to={`/workspaces/${workspace.id}`}>{workspace.name}</Link>
          </div>
        ))
      ) : (
        <p>No workspaces yet</p>
      )}
    </div>
  );
}

export default Home;
