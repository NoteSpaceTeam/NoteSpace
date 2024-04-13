import { Communication } from '@socket/communication';
import { Fugue } from '@editor/crdt/fugue';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { FugueNode } from '@editor/crdt/types';
import { Selection } from '@notespace/shared/types/cursor';
import { isSelectionEmpty } from '@editor/slate/utils/selection';
import { MarkdownHandlers } from '@editor/domain/markdown/types';
import { deleteAroundSelection } from '@editor/domain/markdown/utils';

/**
 * Handlers for markdown operations
 * @param fugue
 * @param communication
 */
export default (fugue: Fugue, communication: Communication): MarkdownHandlers => {
  /**
   * Applies a block style to the editor, and emits the operation to the server.
   * @param style
   * @param line
   */
  const blockHandler = (style: BlockStyle, line: number) => {
    const cursor = { line, column: 0 };
    const triggerNodes: FugueNode[] = fugue.traverseBySeparator(' ', cursor, false).next().value;
    const deleteOperations = triggerNodes.map(node => fugue.deleteLocalById(node.id)).flat();
    communication.emit('operation', deleteOperations);
    applyBlockStyleHandler(style, line);
  };

  /**
   * Applies a block style to the editor.
   * @param style
   * @param line
   */
  const applyBlockStyleHandler = (style: BlockStyle, line: number) => {
    const styleOperation = fugue.updateBlockStyleLocal(style, line);
    communication.emit('operation', [styleOperation]);
  };

  /**
   * Applies an inline style to the editor, and emits the operation to the server.
   * @param style
   * @param triggerLength
   * @param selection
   */
  const inlineHandler = (style: InlineStyle, triggerLength: number, selection: Selection) => {
    const deletions = deleteAroundSelection(selection, triggerLength, fugue);
    communication.emit('operation', deletions);

    // update styles in the tree
    const updatedSelection: Selection = {
      start: { ...selection.start, column: selection.start.column - triggerLength },
      end: { ...selection.end, column: selection.end.column - triggerLength },
    };
    applyInlineStyleHandler(style, updatedSelection);
  };

  /**
   * Applies an inline style to the editor.
   * @param style
   * @param selection
   */
  const applyInlineStyleHandler = (style: InlineStyle, selection: Selection) => {
    const operations = fugue.updateInlineStyleLocal(selection, style);
    communication.emit('operation', operations);
  };

  const deleteHandler = (selection: Selection) => {
    if (isSelectionEmpty(selection)) return;
    const { start, end } = selection;
    if (start.column === 0 || start.line !== end.line) {
      const newSelection = start.line !== end.line ? { start: { line: start.line + 1, column: 0 }, end } : selection;
      const operations = fugue.updateBlockStylesLocalBySelection('paragraph', newSelection);
      communication.emit('operation', operations);
    }
  };

  return {
    blockHandler,
    inlineHandler,
    deleteHandler,
    applyBlockStyleHandler,
    applyInlineStyleHandler,
  };
};
