import { DocumentDatabase, DocumentService } from '@src/types';
import {
  DeleteOperation,
  InsertOperation,
  InlineStyleOperation,
  BlockStyleOperation,
} from '@notespace/shared/crdt/types/operations';
import { FugueTree } from '@notespace/shared/crdt/fugueTree';
import { Nodes } from '@notespace/shared/crdt/types/nodes';

export default function DocumentService(database: DocumentDatabase): DocumentService {
  const tree = new FugueTree<string>();

  async function getDocument() {
    return await database.getDocument();
  }

  function deleteDocument() {
    database.deleteDocument();
  }

  async function insertCharacter(operation: InsertOperation) {
    await updateDocument(() => {
      const { id, value, parent, side, styles } = operation;
      tree.addNode(id, value, parent, side, styles);
    });
  }

  async function deleteCharacter(operation: DeleteOperation) {
    await updateDocument(() => {
      const { id } = operation;
      tree.deleteNode(id);
    });
  }

  async function updateInlineStyle(operation: InlineStyleOperation) {
    await updateDocument(() => {
      const { id, style, value } = operation;
      tree.updateInlineStyle(id, style, value);
    });
  }

  async function updateBlockStyle(operation: BlockStyleOperation) {
    await updateDocument(() => {
      const { style, line } = operation;
      tree.updateBlockStyle(style, line);
    });
  }

  function updateTitle(title: string) {
    database.updateTitle(title);
  }

  async function updateDocument(update: () => void) {
    const { nodes } = await database.getDocument();
    tree.setTree(nodes);
    update();
    const updatedNodes = getNodes();
    database.updateDocument(updatedNodes);
  }

  function getNodes(): Nodes<string> {
    return Object.fromEntries(Array.from(tree.nodes.entries()));
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
