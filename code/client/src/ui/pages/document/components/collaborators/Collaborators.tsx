import useCollaborators from '@ui/pages/document/components/collaborators/useCollaborators';
import { Link } from 'react-router-dom';
import './Collaborators.scss';

function Collaborators() {
  const collaborators = useCollaborators();
  return (
    <div className="collaborators">
      {collaborators.map(collaborator => {
        const nameParts = collaborator.name.split(' ');
        const initials =
          nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}` : nameParts[0][0];
        return (
          <div key={collaborator.id} title={collaborator.name} style={{ backgroundColor: collaborator.color }}>
            <Link to={`/profile/${collaborator.id}`}>{initials}</Link>
          </div>
        );
      })}
    </div>
  );
}

export default Collaborators;
