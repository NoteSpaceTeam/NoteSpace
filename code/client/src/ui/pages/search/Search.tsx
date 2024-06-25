import { Link } from 'react-router-dom';
import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { useEffect, useState } from 'react';
import { useQueryParams } from '@/utils/utils';
import useWorkspaceService from '@services/workspace/useWorkspaceService';
import './Search.scss';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

const PAGE_SIZE = 10;

function Search() {
  const [results, setResults] = useState<WorkspaceMeta[]>([]);
  const [page, setPage] = useState(0);
  const { query } = useQueryParams();
  const service = useWorkspaceService();

  useEffect(() => {
    async function searchWorkspaces() {
      const results = await service.searchWorkspaces(query, page * PAGE_SIZE, PAGE_SIZE);
      setResults(results);
    }
    searchWorkspaces();
  }, [page, query, service]);

  return (
    <div className="search">
      <h2>Search results for "{query}"</h2>
      {results.length > 0 ? (
        results.map(workspace => (
          <div className="workspace">
            <Link key={workspace.id} to={`/workspace/${workspace.id}`}>
              {workspace.name}
            </Link>
          </div>
        ))
      ) : (
        <p>No results found</p>
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
