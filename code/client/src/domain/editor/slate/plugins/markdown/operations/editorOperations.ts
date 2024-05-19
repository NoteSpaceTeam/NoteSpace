import { Editor, Element, Node, Point, Range, Text, Location, type TextUnit, Transforms } from 'slate';
import { shortcuts } from '../shortcuts';
import CustomEditor from '@domain/editor/slate/CustomEditor';
import { isMultiBlock } from '@domain/editor/slate/utils/slate';
import { getSelection } from '@domain/editor/slate/utils/selection';
import { TextDeleteOptions } from 'slate/dist/interfaces/transforms/text';
import { MarkdownDomainOperations } from '@domain/editor/operations/markdown/types';
import { RuleType } from '@domain/editor/slate/plugins/markdown/rules';
import { BlockStyle } from '@notespace/shared/src/document/types/styles';

type InlineFunction = (n: Element) => boolean;
type DeleteBackwardFunction = (unit: TextUnit, options?: { at: Range }) => void;
type DeleteFunction = (options?: TextDeleteOptions) => void;
type InsertTextFunction = (text: string) => void;

/**
 * Returns the point before the given point, offset by the given string offset.
 * @param editor
 * @param at
 * @param stringOffset
 */
function before(editor: Editor, at: Point, stringOffset: number): Point | undefined {
  if (at.offset >= stringOffset) return { offset: at.offset - stringOffset, path: at.path };

  const entry = editor.previous({ at: at.path, match: Text.isText });

  if (!entry) return undefined;

  const [node, path] = entry;
  return before(editor, { offset: node.text.length, path }, stringOffset - at.offset);
}

/**
 * Handler to be called while normalization gets deferred.
 * @param editor
 * @param match
 * @param apply
 */
const normalizeDeferral = (editor: Editor, match: RegExpExecArray, apply: (editor: Editor, range: Range) => void) => {
  const { selection } = editor;
  const { anchor } = selection!;
  const [text, startText, endText] = match;

  const matchEnd = anchor;
  const endMatchStart = endText && before(editor, matchEnd, endText.length);
  const startMatchEnd = startText && before(editor, matchEnd, text.length - startText.length);
  const matchStart = before(editor, matchEnd, text.length);
  if (!matchEnd || !matchStart) return;

  const matchRangeRef = editor.rangeRef({
    anchor: matchStart,
    focus: matchEnd,
  });

  if (endMatchStart) {
    Transforms.delete(editor, {
      at: { anchor: endMatchStart, focus: matchEnd },
    });
  }

  if (startMatchEnd) {
    Transforms.delete(editor, {
      at: { anchor: matchStart, focus: startMatchEnd },
    });
  }

  const applyRange = matchRangeRef.unref();
  if (applyRange) apply(editor, applyRange);
};

/**
 * Adds markdown support to the editor.
 * @param editor
 * @param handlers
 */
export default (editor: Editor, handlers: MarkdownDomainOperations) => {
  /**
   * Inserts the given text into the editor.
   * @param insertText
   * @param insert
   */
  const insertText = (insert: string, insertText: InsertTextFunction): void => {
    // if the insert is not a space, or there is no selection, or the selection is not collapsed, insert the text
    const { selection } = editor;
    if (insert !== ' ' || !selection || !Range.isCollapsed(selection)) {
      insertText(insert);
      return;
    }
    // check if the text before the selection ends with a trigger character
    const { anchor } = selection;
    const block = editor.above({
      match: (n: Node) => Element.isElement(n) && editor.isBlock(n),
    });

    const path = block ? block[1] : [];
    const blockRange = { anchor, focus: editor.start(path) };
    const beforeText = editor.string(blockRange);

    for (const { type, triggers, apply } of shortcuts) {
      const match = triggers.find(trigger => trigger.exec(beforeText) !== null);
      if (!match) continue;
      const execArray = match.exec(beforeText);
      if (!execArray) continue;
      const handler = type === RuleType.Block ? handlers.applyBlockStyle : handlers.applyInlineStyle;
      editor.withoutNormalizing(() => normalizeDeferral(editor, execArray, apply(handler)));
      return;
    }
    insertText(insert);
  };

  /**
   * Inserts a break.
   */
  const insertBreak = (): void => {
    const { selection } = editor;
    if (!selection) return;
    const block = editor.above({
      match: (n: Node) => Element.isElement(n) && editor.isBlock(n),
    });
    const path = block ? block[1] : [];
    const end = editor.end(path);
    Transforms.splitNodes(editor, { always: true });

    const element = block![0] as Element;

    const type = element.type as BlockStyle;
    if (!isMultiBlock(type)) {
      Transforms.setNodes(editor, { type: 'paragraph' });
      CustomEditor.resetMarks(editor);
    } else {
      const { start } = getSelection(editor);
      handlers.applyBlockStyle(type, start.line);
    }
    // if selection was at the end of the block, unwrap the block
    if (!Point.equals(end, Range.end(selection))) return;
    Transforms.unwrapNodes(editor, {
      match: (n: Node) => Element.isElement(n) && editor.isInline(n),
      mode: 'all',
    });
    const marks = editor.marks ?? {};
    Transforms.unsetNodes(editor, Object.keys(marks), { match: Text.isText });
  };

  /**
   * Deletes the text backward.
   * @param deleteBackward
   * @param args
   */
  const deleteBackward = (deleteBackward: DeleteBackwardFunction, ...args: [TextUnit]) => {
    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection)) return;
    const match = editor.above({
      match: (n: Node) => Element.isElement(n) && editor.isBlock(n),
    });
    if(!match) return;
    const [block, path] = match;
    const start = Editor.start(editor, path);

    // If the block is not a paragraph and the selection is at the start of the block, delete the block style
    if (Element.isElement(block) && block.type !== 'paragraph' && Point.equals(selection.anchor, start)) {
      const newSelection = getSelection(editor);
      Transforms.setNodes(editor, { type: 'paragraph' });
      handlers.deleteBlockStyles(newSelection);
      return;
    }
    deleteBackward(...args);
  };

  const deleteSelection = (deleteHandler: DeleteFunction, options?: TextDeleteOptions) => {
    const selection = getSelection(editor);

    console.log("Selection: ", selection);
    console.log("Editor: ", editor.selection);

    // Iterate over the selected lines and delete the block styles
    for (let i = selection.start.line + 1; i <= selection.end.line; i++) {
      const block = editor.children[i];
      if (Element.isElement(block)) {
        // If the block is not a paragraph and the selection is at the start of the block, delete the block style
        // Else remove both the block
        if(block.type !== 'paragraph'){
          const location : Location = {path: [i, 0], offset: 0};
          Transforms.setNodes(editor, { type: 'paragraph' }, { at: location });
          handlers.deleteBlockStyles(selection);
        }
      }
    }
    deleteHandler(options);
  }

  /**
   * Checks if the given node is an inline.
   * @param n
   * @param isInline
   */
  const isInline = (n: Element, isInline: InlineFunction) => (Element.isElement(n) && n.type === 'code') || isInline(n);

  return { insertText, insertBreak, deleteBackward, deleteSelection, isInline };
};
