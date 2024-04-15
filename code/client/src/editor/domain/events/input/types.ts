import { InlineStyle } from '@notespace/shared/types/styles';
import { Cursor } from '@notespace/shared/types/cursor';
import { BaseSelection } from 'slate';

export type InputHandlers = {
  onDeleteSelection : OnDeleteSelectionHandler;
  onKey : OnKeyHandler;
  onEnter : OnEnterHandler;
  onBackspace : OnBackspaceHandler;
  onDelete : OnDeleteHandler;
  onPaste : OnPasteHandler;
  onTab : OnTabHandler;
  onSelection : OnSelectionHandler;
}

export type OnDeleteSelectionHandler = (selection: Selection) => void;
export type OnKeyHandler = (key: string, cursor: Cursor, styles: InlineStyle[]) => void;
export type OnEnterHandler = (cursor: Cursor) => void;
export type OnBackspaceHandler = (cursor: Cursor) => void;
export type OnDeleteHandler = (cursor: Cursor) => void;
export type OnPasteHandler = (start: Cursor, chars: string[], lineNodes: string[]) => void;
export type OnTabHandler = (cursor: Cursor, tab: string) => void;
export type OnSelectionHandler = (range: BaseSelection) => void;