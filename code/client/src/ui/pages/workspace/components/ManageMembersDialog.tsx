import Dialog from '@ui/components/dialog/Dialog';
import { FaUsers } from 'react-icons/fa6';
import { RxCross1 } from 'react-icons/rx';
import './ManageMembersDialog.scss';

type ManageMembersDialog = {
  members: string[];
  onAddMember: (email: string) => void;
  onRemoveMember: (email: string) => void;
};

function ManageMembersDialog({ members, onAddMember, onRemoveMember }: ManageMembersDialog) {
  return (
    <Dialog
      title="Manage Members"
      fields={[{ name: 'Add new member', label: 'User email' }]}
      onSubmit={values => {
        onAddMember(values['Add new member']);
      }}
      submitText="Add Member"
      extraContent={
        <div className="manage-members-dialog">
          <h4>Current Members</h4>
          <ul>
            {members?.map(member => (
              <li key={member}>
                <p>{member}</p>
                {members.length > 1 && (
                  <button onClick={() => onRemoveMember(member)}>
                    <RxCross1 />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <small>Add workspace member</small>
        </div>
      }
    >
      <>
        <FaUsers />
        Members
      </>
    </Dialog>
  );
}

export default ManageMembersDialog;
