import { getKeyFromInputEvent } from '@src/components/editor/slate/utils/domEvents.ts';
import { getSelection, isSelected } from '@src/components/editor/slate/utils/selection.ts';
import { isEqual } from 'lodash';
import { Cursor, emptyCursor } from '@notespace/shared/types/cursor.ts';
import CustomEditor from '@src/components/editor/slate/CustomEditor.ts';
import { InlineStyle } from '@notespace/shared/types/styles.ts';
import { Editor } from 'slate';
import { InputDomainOperations } from '@src/components/editor/domain/document/input/types.ts';
import { ReactEditor } from 'slate-react';

const hotkeys: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
};

export default (editor: Editor, domainOperations: InputDomainOperations, onFormat: (mark: InlineStyle) => void) => {
  function onInput(e: InputEvent) {
    const key = getKeyFromInputEvent(e);
    if (!key) return;

    const selection = getSelection(editor);
    const cursor = selection.start;
    // if there is a selection, delete the selected text
    if (isSelected(editor)) domainOperations.deleteSelection(selection);
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
    domainOperations.insertCharacter(key, cursor, styles);
  }

  /**
   * Handles enter key press
   * @param cursor
   */
  const onEnter = (cursor: Cursor) => domainOperations.insertLineBreak(cursor);

  /**
   * Handles backspace key press
   * Deletes the character before the cursor
   */
  function onBackspace(cursor: Cursor) {
    if (isEqual(cursor, emptyCursor())) return;
    domainOperations.deleteCharacter(cursor);
  }

  /**
   * Handles delete key press
   * Deletes the character after the cursor
   */
  function onDelete({ line, column }: Cursor) {
    const cursor = { line, column };
    domainOperations.deleteCharacter(cursor);
  }

  /**
   * Handles ctrl + backspace
   */
  const onCtrlBackspace = (cursor: Cursor) => domainOperations.deleteWord(cursor, true);

  /**
   * Handles ctrl + delete
   */
  const onCtrlDelete = (cursor: Cursor) => domainOperations.deleteWord(cursor, false);

  /**
   * Handles paste events
   */
  function onPaste(clipboard: ClipboardEvent | string) {
    const clipboardData = typeof clipboard === 'string' ? clipboard : clipboard.clipboardData?.getData('text');
    if (!clipboardData) return;
    const { start } = getSelection(editor);
    domainOperations.pasteText(start, clipboardData);
  }

  function onCut() {
    const selection = getSelection(editor);
    domainOperations.deleteSelection(selection);
  }

  /**
   * Handles tab key press
   */
  function onTab(cursor: Cursor) {
    const tabCharacter = '\t';
    editor.insertText(tabCharacter);
    domainOperations.insertCharacter(tabCharacter, cursor);
  }

  /**
   * Handles cursor selection
   */
  function onSelectionChange() {
    const styles = CustomEditor.getMarks(editor) as InlineStyle[];
    domainOperations.updateSelection(editor.selection, styles);
  }

  function onBlur() {
    ReactEditor.deselect(editor);
    onSelectionChange();
  }

  return { onInput, onPaste, onCut, onSelectionChange, onShortcut, onBlur };
};