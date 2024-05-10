import { Fugue } from '@domain/editor/crdt/fugue';
import { DeleteOperation } from '@notespace/shared/document/types/operations';
import { Id } from '@notespace/shared/document/types/nodes';
import { Selection } from '@notespace/shared/document/types/cursor';

/**
 * Deletes characters around the selection
 * @param selection
 * @param amount
 * @param fugue
 */
export function deleteAroundSelection(selection: Selection, amount: number, fugue: Fugue): DeleteOperation[] {
  const idsToDelete: Id[] = [];
  for (let i = 1; i <= amount; i++) {
    const cursorBefore = { line: selection.start.line, column: selection.start.column - i + 1 };
    const nodeBefore = fugue.getNodeByCursor(cursorBefore);

    const cursorAfter = { line: selection.end.line, column: selection.end.column + i };
    const nodeAfter = fugue.getNodeByCursor(cursorAfter);

    if (!nodeBefore || !nodeAfter) break;
    idsToDelete.push(nodeBefore.id, nodeAfter.id);
  }
  return idsToDelete.map(id => fugue.deleteLocalById(id)).flat();
}
