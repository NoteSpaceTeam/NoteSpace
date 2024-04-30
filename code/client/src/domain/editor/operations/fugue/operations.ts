import { Operation } from '@notespace/shared/crdt/types/operations';
import { Fugue } from '@/domain/editor/crdt/fugue';
import { Document } from '@notespace/shared/crdt/types/document';
import { FugueDomainOperations } from '@/domain/editor/operations/fugue/types';

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

  const initDocument = ({ nodes }: Document) => fugue.init(nodes);

  return {
    applyOperations,
    initDocument,
  };
};
