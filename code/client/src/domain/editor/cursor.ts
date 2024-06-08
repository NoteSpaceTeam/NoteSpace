import { Cursor as Cursor_ } from '@notespace/shared/src/document/types/cursor';

export type Cursor = Cursor_;

export type Selection = {
  start: Cursor;
  end: Cursor;
};

export function emptyCursor(): Cursor {
  return { line: 0, column: 0 };
}

export function emptySelection(): Selection {
  return { start: emptyCursor(), end: emptyCursor() };
}
