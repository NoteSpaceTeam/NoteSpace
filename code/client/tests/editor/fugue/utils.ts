import {
    BlockStyleOperation,
    DeleteOperation,
    InlineStyleOperation,
    InsertOperation,
    Operation, ReviveOperation
} from '@notespace/shared/src/document/types/operations';
import { FugueTree } from '@domain/editor/fugue/FugueTree';
import {Id} from "@notespace/shared/src/document/types/types";
import {BlockStyle, InlineStyle} from "@notespace/shared/src/document/types/styles";
import {rootNode} from "@domain/editor/fugue/utils";

/**
 * Applies the given operations to the tree
 * @param tree the tree to apply the operations to
 * @param operations the operations to apply
 */
export function applyOperations(tree: FugueTree<string>, operations: Operation[]) {
  for (const operation of operations) {
    switch (operation.type) {
      case 'insert':
        tree.addNode(operation.id, operation.value, operation.parent || tree.root.id, operation.side, []);
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
export const FugueUtils = {
    id : function (sender : string, counter : number) : Id{
        return {sender, counter}
    },
    insertText: function (id : Id, props : Partial<InsertOperation>) : InsertOperation{
        return {
            type: 'insert',
            id,
            line: props.line || 0,
            value: props.value || '',
            parent: props.parent || rootNode().id,
            side: props.side || 'R',
            styles: props.styles || [],
        }
    },
    deleteText : function (id : Id) : DeleteOperation{
        return {
            type: 'delete',
            id,
        }
    },
    inlineStyle : function (id : Id, style : InlineStyle, value : boolean) : InlineStyleOperation{
        return {
            type: 'inline-style',
            id,
            style,
            value
        }
    },
    blockStyle : function (line : number, style : BlockStyle, append : boolean) : BlockStyleOperation{
        return {
            type: 'block-style',
            line,
            style,
            append
        }
    },
    revive : function (id : Id) : ReviveOperation{
        return {
            type: 'revive',
            id
        }
    }
}