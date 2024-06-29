import { useEffect, useState } from 'react';
import { DocumentResource } from '@notespace/shared/src/workspace/types/resource';
import useLoading from '@ui/hooks/useLoading';
import { Link } from 'react-router-dom';
import { formatTimePassed } from '@/utils/utils';
import { useCommunication } from '@/contexts/communication/useCommunication';
import useError from '@/contexts/error/useError';
import useAuthRedirect from '@ui/hooks/useAuthRedirect';
import './Recent.scss';

function Recent() {
  const [documents, setDocuments] = useState<DocumentResource[]>([]);
  const { http } = useCommunication();
  const { publishError } = useError();
  const { loading, startLoading, stopLoading, spinner } = useLoading();

  useAuthRedirect();

  useEffect(() => {
    async function fetchRecentDocuments() {
      try {
        startLoading();
        const documents = await http.get('/recent');
        setDocuments(documents);
      } catch (e) {
        publishError(e as Error);
      } finally {
        stopLoading();
      }
    }
    fetchRecentDocuments();
  }, [http, publishError, startLoading, stopLoading]);

  return (
    <div className="recent">
      <h2>Recent Documents</h2>
      {loading ? (
        spinner
      ) : documents.length > 0 ? (
        <ul>
          {documents.map(doc => (
            <li key={doc.id}>
              <Link to={`/workspaces/${doc.workspace}/${doc.id}`}>
                {doc.name} edited {formatTimePassed(doc.updatedAt)}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent documents</p>
      )}
    </div>
  );
}

export default Recent;
