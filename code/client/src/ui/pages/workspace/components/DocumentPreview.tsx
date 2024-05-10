import { IoDocumentText } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { DocumentData } from '@notespace/shared/workspace/types/document.d.ts';
import DocumentContextMenu from '@ui/pages/workspace/components/DocumentContextMenu';
import { useEffect, useRef, useState } from 'react';

type DocumentPreviewProps = {
  doc: DocumentData;
  onDelete: () => void;
  onDuplicate: () => void;
  onRename: (title: string) => void;
};

function DocumentPreview({ doc, onDelete, onRename, onDuplicate }: DocumentPreviewProps) {
  const [title, setTitle] = useState(doc.title || 'Untitled');
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // set the cursor at the end of the title when editing
    if (isEditing && titleRef.current) {
      const range = document.createRange();
      const sel = window.getSelection();
      const childNodes = titleRef.current.childNodes;
      if (!sel || childNodes.length === 0) return;
      range.setStart(titleRef.current.childNodes[0], title.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [title, isEditing]);

  const DocTitle = (
    <li>
      <div>
        <IoDocumentText />
        <span
          ref={titleRef}
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onInput={e => setTitle(e.currentTarget.innerText)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
          onBlur={() => {
            onRename(title);
            setIsEditing(false);
          }}
        >
          {title}
        </span>
      </div>
    </li>
  );

  return (
    <DocumentContextMenu
      item={
        isEditing ? (
          DocTitle
        ) : (
          <Link to={`/documents/${doc.id}`} className="doc-title">
            {DocTitle}
          </Link>
        )
      }
      onRename={() => setIsEditing(true)}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
    />
  );
}

export default DocumentPreview;
