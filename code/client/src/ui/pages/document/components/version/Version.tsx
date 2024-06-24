import './Version.scss';
import VersionControlDialog from '@ui/pages/document/components/version/VersionControlDialog';
import useVersionsService from '@services/versions/useVersionsService';
import { useNavigate, useParams } from 'react-router-dom';
import { MdHistory } from 'react-icons/md';

function Version() {
  const { wid, id } = useParams();
  const { commitVersion } = useVersionsService();
  const navigate = useNavigate();
  return (
    <div className="version">
      <VersionControlDialog onCommit={commitVersion} />
      <button onClick={() => navigate(`/workspaces/${wid}/${id}/commits`)}>
        <MdHistory />
      </button>
    </div>
  );
}

export default Version;
