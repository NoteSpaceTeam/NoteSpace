import { DocumentDatabase, DocumentService } from '@src/types';
import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import { Nodes } from '@notespace/shared/crdt/types/nodes';
import {
  DeleteOperation,
  InsertOperation,
  InlineStyleOperation,
  BlockStyleOperation,
} from '@notespace/shared/crdt/types/operations';
import { ReviveOperation } from '@notespace/shared/crdt/types/operations';

export default function DocumentService(database: DocumentDatabase): DocumentService {
  const tree = new FugueTree<string>();

  async function createDocument() {
    return await database.createDocument();
  }

  async function getDocument(id: string) {
    return await database.getDocument(id);
  }

  async function deleteDocument(id: string) {
    await database.deleteDocument(id);
  }

  async function insertCharacter(id: string, operation: InsertOperation) {
    await updateDocument(id, () => {
      const { id, value, parent, side, styles } = operation;
      tree.addNode(id, value, parent, side, styles);
    });
  }

  async function deleteCharacter(id: string, operation: DeleteOperation) {
    await updateDocument(id, () => {
      const { id } = operation;
      tree.deleteNode(id);
    });
  }

  async function updateInlineStyle(id: string, operation: InlineStyleOperation) {
    await updateDocument(id, () => {
      const { id, style, value } = operation;
      tree.updateInlineStyle(id, style, value);
    });
  }

  async function updateBlockStyle(id: string, operation: BlockStyleOperation) {
    await updateDocument(id, () => {
      const { style, line } = operation;
      tree.updateBlockStyle(style, line);
    });
  }

  async function reviveCharacter(id: string, operation: ReviveOperation) {
    await updateDocument(id, () => {
      const { id } = operation;
      tree.reviveNode(id);
    });
  }

  async function updateDocument(id: string, update: () => void) {
    const { nodes } = await database.getDocument(id);
    tree.setTree(nodes);
    update();
    const updatedNodes = getNodes();
    await database.updateDocument(id, { nodes: updatedNodes });
  }

  function getNodes(): Nodes<string> {
    return Object.fromEntries(Array.from(tree.nodes.entries()));
  }

  async function updateTitle(id: string, title: string) {
    await database.updateDocument(id, { title });
  }

  return {
    createDocument,
    getDocument,
    deleteDocument,
    insertCharacter,
    deleteCharacter,
    updateInlineStyle,
    updateBlockStyle,
    reviveCharacter,
    updateTitle,
  };
}
