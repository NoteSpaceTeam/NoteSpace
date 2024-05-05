import { IoDocumentText } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { DocumentData } from '@notespace/shared/crdt/types/document';
import DocumentContextMenu from '@ui/pages/workspace/components/DocumentContextMenu';

type DocumentPreviewProps = {
  document: DocumentData;
  onDelete: () => void;
  onDuplicate: () => void;
  onRename: () => void;
};

function DocumentPreview({ document, onDelete, onRename, onDuplicate }: DocumentPreviewProps) {
  return (
    <DocumentContextMenu
      item={
        <Link to={`/documents/${document.id}`} className="doc-title">
          <li>
            <div>
              <IoDocumentText />
              {document.title || 'Untitled'}
            </div>
          </li>
        </Link>
      }
      onRename={onRename}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
    />
  );
}

export default DocumentPreview;
