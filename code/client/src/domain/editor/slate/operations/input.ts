import { Editor } from 'slate';
import { ReactEditor } from 'slate-react';
import CustomEditor from '@domain/editor/slate/CustomEditor';
import { isEqual, min } from 'lodash';
import { getKeyFromInputEvent } from '@domain/editor/slate/utils/domEvents';
import { getSelection, isSelected } from '@domain/editor/slate/utils/selection';
import { Cursor, emptyCursor } from '@domain/editor/cursor';
import { InlineStyle } from '@notespace/shared/src/document/types/styles';
import { InputConnector } from '@domain/editor/connectors/input/types';

const hotkeys: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
};

export default (editor: Editor, connector: InputConnector, onFormat: (mark: InlineStyle) => void) => {
  function onInput(e: InputEvent) {
    const key = getKeyFromInputEvent(e);
    if (!key) return;
    const selection = getSelection(editor);
    const cursor = min([{ ...selection.start }, { ...selection.end }]) as Cursor; // always use the start of the selection

    // if there is a selection, delete the selected text
    if (isSelected(editor)) connector.deleteSelection(selection);
    switch (key) {
      case 'Enter':
        onEnter(cursor);
        break;
      case 'Backspace':
        if (isSelected(editor)) break;
        onBackspace(cursor);
        break;
      case 'Delete':
        onDelete(cursor);
        break;
      case 'Paste':
        onPaste(e.data || '');
        break;
      case 'Tab':
        e.preventDefault();
        onTab(cursor);
        break;
      default:
        if (key.length !== 1) break;
        onKey(key, cursor);
        break;
    }
  }

  /**
   * Handles keyboard shortcuts
   * @param event
   */
  function onShortcut(event: KeyboardEvent) {
    if (!event.ctrlKey) return;
    const { start: cursor } = getSelection(editor);
    switch (event.key) {
      case 'Backspace':
        onCtrlBackspace(cursor);
        break;
      case 'Delete':
        onCtrlDelete(cursor);
        break;
      default: {
        const mark = hotkeys[event.key] as InlineStyle;
        if (!mark) break;
        onFormat(mark);
      }
    }
  }

  /**
   * Inserts text at the current cursor position
   * @param key
   * @param cursor
   */
  function onKey(key: string, cursor: Cursor) {
    const styles = CustomEditor.getMarks(editor) as InlineStyle[];
    connector.insertCharacter(key, cursor, styles);
  }

  /**
   * Handles enter key press
   * @param cursor
   */
  const onEnter = (cursor: Cursor) => {
    connector.insertLineBreak(cursor);
  };

  /**
   * Handles backspace key press
   * Deletes the character before the cursor
   */
  function onBackspace(cursor: Cursor) {
    if (isEqual(cursor, emptyCursor())) return;
    connector.deleteCharacter(cursor);
  }

  /**
   * Handles delete key press
   * Deletes the character after the cursor
   */
  const onDelete = ({ line, column }: Cursor) => {
    connector.deleteCharacter({ line, column });
  };

  /**
   * Handles ctrl + backspace
   */
  const onCtrlBackspace = (cursor: Cursor) => {
    connector.deleteWord(cursor, true);
  };

  /**
   * Handles ctrl + delete
   */
  const onCtrlDelete = (cursor: Cursor) => {
    connector.deleteWord(cursor, false);
  };

  /**
   * Handles paste events
   */
  function onPaste(clipboard: ClipboardEvent | string) {
    const clipboardData = typeof clipboard === 'string' ? clipboard : clipboard.clipboardData?.getData('text');
    if (!clipboardData) return;
    const { start } = getSelection(editor);
    connector.pasteText(start, clipboardData);
  }

  function onCut() {
    const selection = getSelection(editor);
    connector.deleteSelection(selection);
  }

  /**
   * Handles tab key press
   */
  function onTab(cursor: Cursor) {
    const tabCharacter = '\t';
    editor.insertText(tabCharacter);
    connector.insertCharacter(tabCharacter, cursor);
  }

  /**
   * Handles cursor selection
   */
  function onSelectionChange(blur = false) {
    const { selection } = editor;
    if (!selection && !blur) return;
    const styles = CustomEditor.getMarks(editor) as InlineStyle[];
    connector.updateSelection(selection, styles);
  }

  function onBlur() {
    ReactEditor.deselect(editor);
    onSelectionChange(true);
  }

  return { onInput, onPaste, onCut, onSelectionChange, onShortcut, onBlur };
};
