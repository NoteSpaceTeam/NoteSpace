import { Link, useParams } from 'react-router-dom';
import ResourceContextMenu from '@ui/pages/workspace/components/ResourceContextMenu';
import useEditing from '@ui/hooks/useEditing';
import { DocumentResource } from '@notespace/shared/src/workspace/types/resource';
import { Checkbox } from '@mui/material';
import { formatDate, formatTimePassed } from '@/utils/utils';
import { useEffect, useState } from 'react';
import useWorkspace from '@/contexts/workspace/useWorkspace';

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
  const { isMember } = useWorkspace();

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
    <ResourceContextMenu
      onRename={() => setIsEditing(true)}
      onOpenInNewTab={() => window.open(`/workspaces/${wid}/${document.id}`, '_blank')}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      enabled={isMember}
    >
      {isEditing ? DocumentComponent : <Link to={`/workspaces/${wid}/${document.id}`}>{DocumentComponent}</Link>}
    </ResourceContextMenu>
  );
}

export default DocumentView;
