import Dialog from '@ui/components/dialog/Dialog';
import { FaPlus } from 'react-icons/fa';
import { WorkspaceInputModel } from '@notespace/shared/src/workspace/types/workspace';

type CreateWorkspaceDialogProps = {
  onCreate: (workspace: WorkspaceInputModel) => void;
};

function CreateWorkspaceDialog({ onCreate }: CreateWorkspaceDialogProps) {
  return (
    <Dialog
      title="Create a new workspace"
      fields={[
        { name: 'name', label: 'Workspace Name' },
        { name: 'isPrivate', label: 'Make Private', type: 'checkbox' },
      ]}
      onSubmit={values => onCreate(values as WorkspaceInputModel)}
      submitText="Create"
    >
      <FaPlus />
    </Dialog>
  );
}

export default CreateWorkspaceDialog;
