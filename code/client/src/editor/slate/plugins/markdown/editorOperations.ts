import { type BaseEditor, Editor, Element, Point, Range, Text, type TextUnit, Transforms } from 'slate';
import { type CustomElement } from '@editor/slate/model/types.ts';
import { shortcuts } from './shortcuts.ts';
import { type ReactEditor } from 'slate-react';
import { type HistoryEditor } from 'slate-history';
import { Fugue } from '@editor/crdt/fugue.ts';
import CustomEditor from '@editor/slate/model/CustomEditor.ts';

type ApplyFunction = (editor: BaseEditor & ReactEditor & HistoryEditor, range: Range) => void;
type InlineFunction = (n: unknown) => boolean;
type DeleteBackwardFunction = (unit: TextUnit, options?: { at: Range }) => void;
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
const normalizeCallback = (editor: Editor, match: RegExpExecArray, apply: ApplyFunction) => {
  const { selection } = editor;
  const { anchor: matchEnd } = selection!;
  const [text, startText, endText] = match;

  const offset = text.length - startText.length;
  const endMatchStart = endText && before(editor, matchEnd, endText.length);
  const startMatchEnd = startText && before(editor, matchEnd, offset);

  const matchStart = before(editor, matchEnd, text.length);

  if (!matchEnd || !matchStart) return;

  const matchRangeRef = editor.rangeRef({ anchor: matchStart, focus: matchEnd });

  if (endMatchStart || startMatchEnd) {
    Transforms.delete(editor, {
      at: {
        anchor: endMatchStart ? endMatchStart : matchStart,
        focus: startMatchEnd ? startMatchEnd : matchEnd,
      },
    });
  }

  const applyRange = matchRangeRef.unref();
  if (applyRange) apply(editor, applyRange);
};

/**
 * Inserts the given text into the editor.
 * @param insertText
 * @param insert
 * @param editor
 */
const insertText = (editor: Editor, insertText: InsertTextFunction, insert: string): void => {
  const { selection } = editor;
  if (insert !== ' ' || !selection || !Range.isCollapsed(selection)) {
    insertText(insert);
    return;
  }

  // Check if the text before the selection ends with a trigger character
  const { anchor } = selection;

  const block = editor.above({ match: (n: CustomElement) => editor.isBlock(n) });

  const path = block ? block[1] : [];
  const blockRange = { anchor, focus: editor.start(path) };
  const beforeText = editor.string(blockRange);

  for (const { triggers, apply } of shortcuts) {
    const match = triggers.find(trigger => trigger.exec(beforeText) !== null);
    if (!match) continue;

    const execArray = match.exec(beforeText);
    if (!execArray) continue;
    editor.withoutNormalizing(() => normalizeCallback(editor, execArray, apply));
    return;
  }
  insertText(insert);
};

/**
 * Inserts a break.
 * @param editor
 */
const insertBreak = (editor: Editor): void => {
  const { selection } = editor;
  if (selection) {
    const block = editor.above({
      match: (n: CustomElement) => editor.isBlock(n),
    });
    const path = block ? block[1] : [];
    const end = editor.end(path);

    Transforms.splitNodes(editor, { always: true });
    Transforms.setNodes(editor, { type: 'paragraph' });
    CustomEditor.resetMarks(editor);

    // if selection was at the end of the block, unwrap the block
    if (Point.equals(end, Range.end(selection))) {
      Transforms.unwrapNodes(editor, {
        match: (n: CustomElement) => editor.isInline(n),
        mode: 'all',
      });
      const marks = editor.marks ?? {};
      Transforms.unsetNodes(editor, Object.keys(marks), { match: Text.isText });
    }
  }
};

/**
 * Deletes the text backward.
 * @param editor
 * @param deleteBackward
 * @param args
 */
const deleteBackward = (editor: Editor, deleteBackward: DeleteBackwardFunction, ...args: [TextUnit]) => {
  const { selection } = editor;
  if (selection && Range.isCollapsed(selection)) {
    const match = editor.above({
      match: (n: CustomElement) => editor.isBlock(n),
    });
    if (match) {
      const [block, path] = match;
      const start = Editor.start(editor, path);

      if (
        !Editor.isEditor(block) &&
        Element.isElement(block) &&
        block.type !== 'paragraph' &&
        Point.equals(selection.anchor, start)
      ) {
        // reset block style to paragraph
        const fugue = Fugue.getInstance();
        const line = selection.anchor.path[0];
        fugue.updateBlockStyleLocal('paragraph', line);
        Transforms.setNodes(editor, { type: 'paragraph' });
        return;
      }
    }
    deleteBackward(...args);
  }
};

/**
 * Checks if the given node is an inline.
 * @param n
 * @param isInline
 */
const isInline = (n: unknown, isInline: InlineFunction) =>
  (Element.isElement(n) && n.type === 'inline-code') || isInline(n);

export { insertText, insertBreak, deleteBackward, isInline };
