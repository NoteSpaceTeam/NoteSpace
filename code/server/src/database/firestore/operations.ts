import { setDocument, updateTree } from '@database/firestore/firestore';
import { DocumentDatabase } from '@src/types';
import { Document } from '@notespace/shared/crdt/types/document';
import {
  InsertOperation,
  DeleteOperation,
  InlineStyleOperation,
  BlockStyleOperation,
} from '@notespace/shared/crdt/types/operations';

export default function DocumentDatabase(): DocumentDatabase {
  async function getDocument(): Promise<Document> {
    // const tree = await getTreeInstance();
    // const nodes = Object.fromEntries(tree.nodes);
    throw new Error('Not implemented');
  }

  async function deleteDocument() {
    await setDocument({});
  }

  async function insertCharacter({ id, value, parent, side }: InsertOperation) {
    await updateTree(tree => {
      tree.addNode(id, value, parent, side);
    });
  }

  async function deleteCharacter({ id }: DeleteOperation) {
    await updateTree(tree => {
      tree.deleteNode(id);
    });
  }

  async function updateInlineStyle({ id, style, value }: InlineStyleOperation) {
    await updateTree(tree => {
      tree.updateInlineStyle(id, style, value);
    });
  }

  async function updateBlockStyle({ style, line }: BlockStyleOperation) {
    await updateTree(tree => {
      tree.updateBlockStyle(style, line);
    });
  }

  async function updateTitle(title: string) {
    throw new Error('Not implemented' + title);
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
