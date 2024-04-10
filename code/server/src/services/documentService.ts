import { DocumentDatabase, DocumentService } from '@src/types';
import {
  DeleteOperation,
  InsertOperation,
  InlineStyleOperation,
  BlockStyleOperation,
} from '@notespace/shared/crdt/types/operations';

export default function DocumentService(database: DocumentDatabase): DocumentService {
  async function getDocument() {
    return await database.getDocument();
  }

  function deleteDocument() {
    database.deleteDocument();
  }

  function insertCharacter(operation: InsertOperation) {
    database.insertCharacter(operation);
  }

  function deleteCharacter(operation: DeleteOperation) {
    database.deleteCharacter(operation);
  }

  function updateInlineStyle(operation: InlineStyleOperation) {
    database.updateInlineStyle(operation);
  }

  function updateBlockStyle(operation: BlockStyleOperation) {
    database.updateBlockStyle(operation);
  }

  function updateTitle(title: string) {
    database.updateTitle(title);
  }

  return {
    getDocument,
    deleteDocument,
    insertCharacter,
    deleteCharacter,
    updateInlineStyle,
    updateBlockStyle,
    updateTitle,
  };
}
