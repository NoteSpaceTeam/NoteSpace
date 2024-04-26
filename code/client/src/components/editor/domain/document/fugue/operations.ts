import { Operation } from '@notespace/shared/crdt/types/operations.ts';
import { Fugue } from '@src/components/editor/crdt/fugue.ts';
import { Document } from '@notespace/shared/crdt/types/document.ts';
import { FugueDomainOperations } from '@src/components/editor/domain/document/fugue/types.ts';

export default (fugue: Fugue): FugueDomainOperations => {
  function applyOperations(operations: Operation[]) {
    for (const operation of operations) {
      switch (operation.type) {
        case 'insert':
          fugue.insertRemote(operation);
          break;
        case 'delete':
          fugue.deleteRemote(operation);
          break;
        case 'inline-style':
          fugue.updateInlineStyleRemote(operation);
          break;
        case 'block-style':
          fugue.updateBlockStyleRemote(operation);
          break;
        case 'revive':
          fugue.reviveRemote(operation);
          break;
        default:
          throw new Error('Invalid operation type');
      }
    }
  }

  function initDocument({ nodes }: Document) {
    fugue.init(nodes);
  }

  return {
    applyOperations,
    initDocument,
  };
};
