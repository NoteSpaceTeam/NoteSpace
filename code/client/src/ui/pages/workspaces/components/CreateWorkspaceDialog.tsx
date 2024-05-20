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
        // { name: 'description', label: 'Workspace Description' },
        // { name: 'visibility', label: 'Workspace Visibility' },
        // { name: 'tags', label: 'Workspace Tags' },
        // { name: 'members', label: 'Workspace Members' },
      ]}
      onSubmit={values => onCreate({ name: values.name })}
    >
      <p>New</p>
      <FaPlus />
    </Dialog>
  );
}

export default CreateWorkspaceDialog;
