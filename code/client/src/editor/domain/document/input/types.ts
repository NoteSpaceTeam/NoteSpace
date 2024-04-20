import { InlineStyle } from '@notespace/shared/types/styles';
import { Cursor, Selection } from '@notespace/shared/types/cursor';
import { BaseSelection } from 'slate';

export type InputDomainOperations = {
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
export type PasteTextHandler = (start: Cursor, text: string[], lineNodes: string[]) => void;
export type UpdateSelectionHandler = (range: BaseSelection) => void;