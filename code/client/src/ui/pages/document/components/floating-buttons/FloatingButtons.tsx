import './FloatingButtons.scss';
import CommitDialog from '@ui/pages/document/components/floating-buttons/CommitDialog';
import useCommitsService from '@services/commits/useCommitsService';
import { useNavigate, useParams } from 'react-router-dom';
import { MdHistory } from 'react-icons/md';

function FloatingButtons() {
  const { wid, id } = useParams();
  const { commit } = useCommitsService();
  const navigate = useNavigate();
  return (
    <div className="floating-buttons">
      <CommitDialog onCommit={commit} />
      <button onClick={() => navigate(`/workspaces/${wid}/${id}/commits`)}>
        <MdHistory />
      </button>
    </div>
  );
}

export default FloatingButtons;
