import {
  DeleteOperation,
  InsertOperation,
  InlineStyleOperation,
  BlockStyleOperation,
} from '@notespace/shared/crdt/types/operations';
import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import { Nodes } from '@notespace/shared/crdt/types/nodes';
import { DocumentDatabase } from '@src/types';
import { Document } from '@notespace/shared/crdt/types/document';

let tree = new FugueTree<string>();
let documentTitle = '';

async function getNodes(): Promise<Nodes<string>> {
  return Object.fromEntries(Array.from(tree.nodes.entries()));
}

function deleteTree(): void {
  tree = new FugueTree();
}

export default function DocumentDatabase(): DocumentDatabase {
  async function getDocument(): Promise<Document> {
    const nodes = await getNodes();
    return {
      title: documentTitle,
      nodes,
    };
  }

  function deleteDocument(): void {
    deleteTree();
  }

  function insertCharacter({ id, value, parent, side, styles }: InsertOperation): void {
    tree.addNode(id, value, parent, side, styles);
  }

  function deleteCharacter({ id }: DeleteOperation): void {
    tree.deleteNode(id);
  }

  function updateInlineStyle({ id, style, value }: InlineStyleOperation): void {
    tree.updateInlineStyle(id, style, value);
  }

  function updateBlockStyle({ line, style }: BlockStyleOperation): void {
    tree.updateBlockStyle(style, line);
  }

  function updateTitle(title: string): void {
    documentTitle = title;
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
