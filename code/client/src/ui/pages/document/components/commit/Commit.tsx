import useCommitsService from '@services/commits/useCommitsService';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CommitData } from '@notespace/shared/src/document/types/commits';
import useLoading from '@ui/hooks/useLoading';
import { formatTimePassed } from '@/utils/utils';
import useFugue from '@domain/editor/fugue/useFugue';
import EditorPreview from '@ui/pages/document/components/editor-preview/EditorPreview';
import { toSlate } from '@domain/editor/slate/utils/slate';
import './Commit.scss';

function Commit() {
  const { loading, startLoading, stopLoading, spinner } = useLoading();
  const [commit, setCommit] = useState<CommitData>();
  const { getCommit } = useCommitsService();
  const { commitId } = useParams();
  const fugue = useFugue();

  useEffect(() => {
    async function fetchCommit() {
      const commit = await getCommit(commitId!);
      setCommit(commit);
      fugue.applyOperations(commit.content, true);
      stopLoading();
    }
    startLoading();
    fetchCommit();
  }, [commitId, fugue, getCommit, startLoading, stopLoading]);

  return (
    <div className="commit">
      {loading ? (
        spinner
      ) : (
        <>
          <h2>Commit</h2>
          <p>
            Committed by <Link to={`/profile/${commit!.author.id}`}>{commit!.author.name}</Link>
            &nbsp;{formatTimePassed(new Date(commit!.timestamp).toLocaleString())}
          </p>
          <EditorPreview descendants={toSlate(fugue)} />
        </>
      )}
    </div>
  );
}

export default Commit;
