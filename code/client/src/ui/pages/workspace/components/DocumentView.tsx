import { Link, useParams } from 'react-router-dom';
import { FaFile } from 'react-icons/fa6';
import DocumentContextMenu from '@ui/pages/workspace/components/DocumentContextMenu';
import useEditing from '@ui/hooks/useEditing';
import { DocumentResource } from '@notespace/shared/src/workspace/types/resource';
import { Checkbox } from '@mui/material';
import React from 'react';

type DocumentViewProps = {
  document: DocumentResource;
  onDelete: () => void;
  onDuplicate: () => void;
  onRename: (title: string) => void;
};

function DocumentView({ document, onDelete, onRename, onDuplicate }: DocumentViewProps) {
  const { wid } = useParams();
  const { component, isEditing, setIsEditing } = useEditing(document.name || 'Untitled', onRename);
  const DocumentComponent = (
    <div className="table-row">
      <div>
        <FaFile />
        {component}
      </div>
      <p>{document.createdAt}</p>
      <p>{document.updatedAt}</p>
    </div>
  );
  return (
    <DocumentContextMenu onRename={() => setIsEditing(true)} onDuplicate={onDuplicate} onDelete={onDelete}>
      <Checkbox
        className="document-checkbox"
        checked={false}
        onChange={e => {
          e.stopPropagation();
        }}
      />
      {isEditing ? DocumentComponent : <Link to={`/workspaces/${wid}/${document.id}`}>{DocumentComponent}</Link>}
    </DocumentContextMenu>
  );
}

export default DocumentView;
