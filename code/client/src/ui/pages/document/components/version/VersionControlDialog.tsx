import Dialog from '@ui/components/dialog/Dialog';
import { useParams } from 'react-router-dom';
import { FaCodeCommit } from 'react-icons/fa6';
import { useAuth } from '@/contexts/auth/useAuth';

type VersionControlDialogProps = {
  onCommit: () => void;
};

function VersionControlDialog({ onCommit }: VersionControlDialogProps) {
  const { wid, id } = useParams();
  const { currentUser } = useAuth();
  if (!wid || !id) throw new Error('Cannot use version dialog outside of a document');
  return (
    <Dialog
      title="New Commit"
      fields={[]}
      onSubmit={onCommit}
      submitText="Commit"
      extraContent={
        <div className="commits-dialog">
          <p>
            Committing as <strong>{currentUser!.displayName}</strong>
          </p>
        </div>
      }
    >
      <FaCodeCommit />
    </Dialog>
  );
}

export default VersionControlDialog;
