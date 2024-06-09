import { Cursor, Selection } from '@domain/editor/cursor';
import { InlineStyle } from '@notespace/shared/src/document/types/styles';
import { BaseSelection } from 'slate';

export type InputConnector = {
  insertCharacter: InsertCharacterHandler;
  insertLineBreak: InsertLineBreakHandler;
  deleteCharacter: DeleteCharacterHandler;
  deleteSelection: DeleteSelectionHandler;
  deleteWord: DeleteWordHandler;
  pasteText: PasteTextHandler;
  updateSelection: UpdateSelectionHandler;
};

export type InsertCharacterHandler = (char: string, cursor: Cursor, styles?: InlineStyle[]) => void;
export type InsertLineBreakHandler = (cursor: Cursor) => void;
export type DeleteCharacterHandler = (cursor: Cursor) => void;
export type DeleteSelectionHandler = (selection: Selection) => void;
export type DeleteWordHandler = (cursor: Cursor, reverse: boolean) => void;
export type PasteTextHandler = (start: Cursor, text: string) => void;
export type UpdateSelectionHandler = (range: BaseSelection, styles: InlineStyle[]) => void;
