import { IoDocumentText } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Document } from '@notespace/shared/crdt/types/document';
import DocumentContextMenu from '@ui/pages/workspace/components/DocumentContextMenu';

type DocumentPreviewProps = {
  document: Document;
  onDeleteDocument: () => void;
};

function DocumentPreview({ document, onDeleteDocument }: DocumentPreviewProps) {
  const documentComponent = (
    <Link to={`/documents/${document.id}`} className="doc-title">
      <li>
        <div>
          <IoDocumentText />
          {document.title || 'Untitled'}
        </div>
        <button onClick={onDeleteDocument}>
          <MdDelete />
        </button>
      </li>
    </Link>
  );
  return (
    <div>
      <DocumentContextMenu
        item={documentComponent}
        onRename={() => console.log('rename ' + document.id)}
        onDelete={() => console.log('delete ' + document.id)}
        onDuplicate={() => console.log('duplicate ' + document.id)}
      />
    </div>
  );
}

export default DocumentPreview;
