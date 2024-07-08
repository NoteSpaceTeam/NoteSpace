import { Link } from 'react-router-dom';
import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { useEffect, useState } from 'react';
import { useQueryParams } from '@/utils/utils';
import useWorkspaceService from '@services/workspace/useWorkspaceService';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import useLoading from '@ui/hooks/useLoading';
import './Search.scss';

const PAGE_SIZE = 10;

function Search() {
  const [results, setResults] = useState<WorkspaceMeta[]>([]);
  const [page, setPage] = useState(0);
  const { query } = useQueryParams();
  const { spinner, startLoading, stopLoading, loading } = useLoading();
  const service = useWorkspaceService();

  useEffect(() => {
    async function searchWorkspaces() {
      startLoading();
      const results = await service.searchWorkspaces(query, page * PAGE_SIZE, PAGE_SIZE);
      setResults(results);
      stopLoading();
    }
    searchWorkspaces();
  }, [page, query, service, startLoading, stopLoading]);

  return (
    <div className="search">
      {loading ? (
        <>
          <h2>Searching...</h2>
          {spinner}
        </>
      ) : (
        <>
          <h2>Search results for "{query}"</h2>
          {results.length > 0 ? (
            results.map(workspace => (
              <div className="workspace">
                <Link key={workspace.id} to={`/workspaces/${workspace.id}`}>
                  {workspace.name}
                </Link>
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </>
      )}
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 0}>
          <FaArrowLeft />
        </button>
        <button onClick={() => setPage(page + 1)} disabled={results.length < PAGE_SIZE}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

export default Search;
