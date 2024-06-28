import useCollaborators from '@ui/pages/document/components/collaborators/useCollaborators';
import { useNavigate } from 'react-router-dom';
import './Collaborators.scss';

function Collaborators() {
  const collaborators = useCollaborators();
  const navigate = useNavigate();

  function scrollIntoView(id: string) {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="collaborators">
      {collaborators.map(collaborator => {
        const nameParts = collaborator.name.split(' ');
        const initials =
          nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}` : nameParts[0][0];
        return (
          <button
            key={collaborator.id}
            title={collaborator.name}
            style={{ backgroundColor: collaborator.color }}
            onClick={() => scrollIntoView(collaborator.socketId)}
            onContextMenu={e => {
              e.preventDefault();
              navigate(`/profile/${collaborator.id}`);
            }}
          >
            {initials}
          </button>
        );
      })}
    </div>
  );
}

export default Collaborators;
