import { Link, useParams } from 'react-router-dom';
import DocumentContextMenu from '@ui/pages/workspace/components/DocumentContextMenu';
import useEditing from '@ui/hooks/useEditing';
import { DocumentResource } from '@notespace/shared/src/workspace/types/resource';
import { Checkbox } from '@mui/material';
import '../../../components/table/DataTable.scss';
import { formatDate } from '@/utils/utils';
import { useEffect, useState } from 'react';

type DocumentViewProps = {
  document: DocumentResource;
  selected: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
  onRename: (title: string) => void;
};

function DocumentView({ document, onDelete, onRename, onDuplicate, selected }: DocumentViewProps) {
  const { wid } = useParams();
  const { component, isEditing, setIsEditing } = useEditing(document.name || 'Untitled', onRename);
  const [isSelected, setSelected] = useState(selected);

  useEffect(() => {
    setSelected(selected);
  }, [selected]);

  const DocumentComponent = (
    <div className="table-row">
      <Checkbox checked={isSelected} onChange={() => setSelected(!isSelected)} onClick={e => e.stopPropagation()} />
      {component}
      <p>{formatDate(document.createdAt)}</p>
      <p>{formatDate(document.updatedAt)}</p>
    </div>
  );
  return (
    <DocumentContextMenu onRename={() => setIsEditing(true)} onDuplicate={onDuplicate} onDelete={onDelete}>
      {isEditing ? DocumentComponent : <Link to={`/workspaces/${wid}/${document.id}`}>{DocumentComponent}</Link>}
    </DocumentContextMenu>
  );
}

export default DocumentView;
