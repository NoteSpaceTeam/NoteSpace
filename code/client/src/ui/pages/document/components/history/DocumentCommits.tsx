import './DocumentCommits.scss';
import useVersionsService from '@services/versions/useVersionsService';
import { Link, useParams } from 'react-router-dom';
import useResourcesService from '@services/resource/useResourcesService';
import { useEffect, useState } from 'react';
import useLoading from '@ui/hooks/useLoading';
import { DocumentResource } from '@notespace/shared/src/workspace/types/resource';
import { DocumentVersion } from '@notespace/shared/src/document/types/versions';
import { formatTimePassed } from '@/utils/utils';
import { FaCodeFork } from 'react-icons/fa6';
import { FaUndo } from 'react-icons/fa';

function DocumentCommits() {
  const [document, setDocument] = useState<DocumentResource>();
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const { loading, spinner, startLoading, stopLoading } = useLoading();
  const { id } = useParams();
  const { getResource } = useResourcesService();
  const { getVersions, forkVersion, rollbackVersion } = useVersionsService();

  useEffect(() => {
    async function fetchDocument() {
      const document = (await getResource(id!)) as DocumentResource;
      setDocument(document);
    }
    async function fetchVersions() {
      const versions = await getVersions();
      setVersions(versions);
    }
    startLoading();
    Promise.all([fetchDocument(), fetchVersions()])
      .then(() => stopLoading())
      .catch(() => stopLoading());
  }, [getResource, getVersions, id, startLoading, stopLoading]);

  return (
    <div className="document-commits">
      {loading ? (
        spinner
      ) : (
        <>
          <h2>Commits from "{document?.name}"</h2>
          <div className="commits-list">
            {versions.length > 0 ? (
              versions.map(version => (
                <div key={version.id} className="commit">
                  <p>
                    <Link to={''}>John Doe</Link> committed{' '}
                    {formatTimePassed(new Date(version.timestamp).toLocaleString())}
                  </p>
                  <div className="commit-actions">
                    <button onClick={() => rollbackVersion(version.id)}>
                      <FaUndo />
                      Rollback
                    </button>
                    <button onClick={() => forkVersion(version.id)}>
                      <FaCodeFork />
                      Fork
                    </button>
                  </div>
                </div>
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

export default DocumentCommits;
