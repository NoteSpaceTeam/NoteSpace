import useCommitsService from '@services/commits/useCommitsService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useResourcesService from '@services/resource/useResourcesService';
import { useEffect, useState } from 'react';
import useLoading from '@ui/hooks/useLoading';
import { DocumentResource } from '@notespace/shared/src/workspace/types/resource';
import { Commit } from '@notespace/shared/src/document/types/commits';
import { formatTimePassed } from '@/utils/utils';
import { FaClone } from 'react-icons/fa6';
import { FaUndo } from 'react-icons/fa';
import useWorkspace from '@/contexts/workspace/useWorkspace';
import './CommitHistory.scss';

function CommitHistory() {
  const [document, setDocument] = useState<DocumentResource>();
  const [commits, setCommits] = useState<Commit[]>([]);
  const { loading, spinner, startLoading, stopLoading } = useLoading();
  const { wid, id } = useParams();
  const { getResource } = useResourcesService();
  const { getCommits, clone, rollback } = useCommitsService();
  const { isMember } = useWorkspace();
  const navigate = useNavigate();

  async function onRollback(commitId: string) {
    await rollback(commitId);
    navigate(`/workspaces/${wid}/${id}`);
  }

  async function onClone(commitId: string) {
    await clone(commitId);
    navigate(`/workspaces/${wid}`);
  }

  useEffect(() => {
    async function fetchDocument() {
      const document = (await getResource(id!)) as DocumentResource;
      setDocument(document);
    }
    async function fetchCommits() {
      const commits = await getCommits();
      setCommits(commits);
    }
    startLoading();
    Promise.all([fetchDocument(), fetchCommits()])
      .then(() => stopLoading())
      .catch(() => stopLoading());
  }, [getResource, getCommits, id, startLoading, stopLoading]);

  return (
    <div className="document-commits">
      {loading ? (
        spinner
      ) : (
        <>
          <h2>Commits from "{document?.name}"</h2>
          <div className="commits-list">
            {commits.length > 0 ? (
              commits.map(commit => (
                <Link to={`/workspaces/${wid}/${id}/commits/${commit.id}`} key={commit.id} className="commit">
                  <p>
                    <Link to={`/profile/${commit.author.id}`}>{commit.author.name}</Link> committed{' '}
                    {formatTimePassed(new Date(commit.timestamp).toLocaleString())}
                  </p>
                  {isMember && (
                    <div className="commit-actions">
                      <button onClick={() => onRollback(commit.id)}>
                        <FaUndo />
                        Rollback
                      </button>
                      <button onClick={() => onClone(commit.id)}>
                        <FaClone />
                        Clone
                      </button>
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <p>No commits yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CommitHistory;
