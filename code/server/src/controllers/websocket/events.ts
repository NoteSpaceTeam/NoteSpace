import onOperation from '@controllers/websocket/document/onOperation';
import onCursorChange from '@controllers/websocket/document/onCursorChange';
import { DocumentService, SocketHandler } from '@src/types';
import onEditorOperations from '@controllers/websocket/document/onEditorOperations';
import onTitleChange from '@controllers/websocket/document/onTitleChange';

export default function events(service: DocumentService): Record<string, SocketHandler> {
  if (!service) {
    throw new Error('Service parameter is required');
  }
  return {
    operation: onOperation(service),
    cursorChange: onCursorChange(),
    editorOperations: onEditorOperations(),
    titleChange: onTitleChange(service),
  };
}
