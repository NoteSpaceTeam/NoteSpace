import Dialog from '@ui/components/dialog/Dialog';
import { RxCross1 } from 'react-icons/rx';
import { MdManageAccounts } from 'react-icons/md';
import './ManageMembersDialog.scss';

type ManageWorkspaceDialogProps = {
  members: string[];
  onAddMember: (email: string) => void;
  onRemoveMember: (email: string) => void;
  isPrivate: boolean;
  toggleVisibility: () => void;
};

function ManageWorkspaceDialog({
  members,
  onAddMember,
  onRemoveMember,
  isPrivate,
  toggleVisibility,
}: ManageWorkspaceDialogProps) {
  return (
    <Dialog
      title="Manage Workspace"
      fields={[{ name: 'Add new member', label: 'User email' }]}
      onSubmit={values => {
        onAddMember(values['Add new member']);
      }}
      submitText="Add Member"
      extraContent={
        <div className="manage-workspace-dialog">
          <button onClick={toggleVisibility}>Make {isPrivate ? 'Public' : 'Private'}</button>
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
        <MdManageAccounts />
        Manage
      </>
    </Dialog>
  );
}

export default ManageWorkspaceDialog;
