import {Operation} from "@notespace/shared/crdt/types/operations";
import {FugueTree} from "@notespace/shared/crdt/FugueTree";

/**
 * Applies the given operations to the tree
 * @param tree the tree to apply the operations to
 * @param operations the operations to apply
 */
export function applyOperations(tree : FugueTree<string>, operations: Operation[]) {
    for (const operation of operations) {
        switch (operation.type) {
            case 'insert':
                tree.addNode(
                    operation.id,
                    operation.value,
                    operation.parent || tree.root.id,
                    operation.side,
                    []
                );
                break;
            case 'delete':
                tree.deleteNode(operation.id);
                break;
            case 'inline-style':
                tree.updateInlineStyle(operation.id, operation.style, operation.value);
                break;
            case 'block-style':
                tree.updateBlockStyle(operation.style, operation.line);
                break;
            case 'revive':
                tree.reviveNode(operation.id);
                break;
            default:
                throw new Error('Invalid operation type');
        }
    }
}
