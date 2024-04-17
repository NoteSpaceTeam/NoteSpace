import { Communication } from '@editor/domain/communication';
import SlateEditor from '@editor/slate/SlateEditor';
import './DocumentEditor.scss';

type DocumentEditorProps = {
  communication: Communication;
};

function DocumentEditor({ communication }: DocumentEditorProps) {
  return <SlateEditor communication={communication} />;
}

export default DocumentEditor;
