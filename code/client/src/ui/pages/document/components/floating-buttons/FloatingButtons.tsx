import './FloatingButtons.scss';
import CommitDialog from '@ui/pages/document/components/floating-buttons/CommitDialog';
import useCommitsService from '@services/commits/useCommitsService';
import { useNavigate, useParams } from 'react-router-dom';
import { MdHistory } from 'react-icons/md';
import useWorkspace from '@/contexts/workspace/useWorkspace';

function FloatingButtons() {
  const { wid, id } = useParams();
  const { commit } = useCommitsService();
  const { isMember } = useWorkspace();
  const navigate = useNavigate();
  return (
    <div className="floating-buttons">
      {isMember && <CommitDialog onCommit={commit} />}
      <button onClick={() => navigate(`/workspaces/${wid}/${id}/commits`)}>
        <MdHistory />
      </button>
    </div>
  );
}

export default FloatingButtons;
