import Dialog from '@ui/components/dialog/Dialog';
import { RxCross1 } from 'react-icons/rx';
import { MdManageAccounts } from 'react-icons/md';
import './ManageMembersDialog.scss';
import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';

type ManageWorkspaceDialogProps = {
  workspace: WorkspaceMeta;
  onAddMember: (email: string) => void;
  onRemoveMember: (email: string) => void;
  toggleVisibility: () => void;
};

function ManageWorkspaceDialog({
  workspace,
  onAddMember,
  onRemoveMember,
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
          <button onClick={toggleVisibility}>Make {workspace.isPrivate ? 'Public' : 'Private'}</button>
          <h4>Current Members</h4>
          <ul>
            {workspace.members?.map((member: string) => (
              <li key={member}>
                <p>{member}</p>
                {workspace.members.length > 1 && (
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
