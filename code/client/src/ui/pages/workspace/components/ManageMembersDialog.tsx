import Dialog from '@ui/components/dialog/Dialog';
import { FaCross, FaUsers } from 'react-icons/fa6';
import { UserData } from '@notespace/shared/src/users/types';

type ManageMembersDialog = {
  members: UserData[];
  onAddMember: (email: string) => void;
  onRemoveMember: (email: string) => void;
};

function ManageMembersDialog({ members, onAddMember, onRemoveMember }: ManageMembersDialog) {
  return (
    <Dialog
      title="Manage members in workspace"
      fields={[{ name: 'Add new member', label: 'User email' }]}
      onSubmit={values => {
        onAddMember(values['Add new member']);
      }}
      submitText="Add Member"
      extraContent={
        <div>
          <h3>Members</h3>
          <ul>
            {members?.map(member => (
              <li key={member.email}>
                <p>{member.email}</p>
                <button onClick={() => onRemoveMember(member.email)}>
                  <FaCross />
                </button>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <div>
        <FaUsers />
        Members
      </div>
    </Dialog>
  );
}

export default ManageMembersDialog;
