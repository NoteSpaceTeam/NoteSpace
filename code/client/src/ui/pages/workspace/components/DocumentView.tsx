import { Link, useParams } from 'react-router-dom';
import DocumentContextMenu from '@ui/pages/workspace/components/DocumentContextMenu';
import useEditing from '@ui/hooks/useEditing';
import { DocumentResource } from '@notespace/shared/src/workspace/types/resource';
import { Checkbox } from '@mui/material';
import { formatDate, formatTimePassed } from '@/utils/utils';
import { useEffect, useState } from 'react';

type DocumentViewProps = {
  document: DocumentResource;
  selected: boolean;
  onSelect: (value: boolean) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onRename: (title: string) => void;
};

function DocumentView({ document, onSelect, onDelete, onRename, onDuplicate, selected }: DocumentViewProps) {
  const { wid } = useParams();
  const { component, isEditing, setIsEditing } = useEditing(document.name || 'Untitled', onRename);
  const [isSelected, setSelected] = useState(selected);

  useEffect(() => {
    setSelected(selected);
  }, [selected]);

  function onCheckboxSelected() {
    setSelected(!isSelected);
    onSelect(!isSelected);
  }

  const DocumentComponent = (
    <div className="table-row">
      <Checkbox checked={isSelected} onChange={onCheckboxSelected} onClick={e => e.stopPropagation()} />
      {component}
      <p>{formatDate(document.createdAt)}</p>
      <p>{formatTimePassed(document.updatedAt)}</p>
    </div>
  );
  return (
    <DocumentContextMenu onRename={() => setIsEditing(true)} onDuplicate={onDuplicate} onDelete={onDelete}>
      {isEditing ? DocumentComponent : <Link to={`/workspaces/${wid}/${document.id}`}>{DocumentComponent}</Link>}
    </DocumentContextMenu>
  );
}

export default DocumentView;
