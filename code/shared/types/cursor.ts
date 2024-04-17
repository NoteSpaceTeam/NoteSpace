export type Cursor = {
  line: number;
  column: number;
};

export type Selection = {
  start: Cursor;
  end: Cursor;
};

export function emptySelection(): Selection {
  return { start: emptyCursor(), end: emptyCursor() };
}

export function emptyCursor(): Cursor {
  return { line: 0, column: 0 };
}

export function toCursor(line: number, column: number): Cursor {
  return { line, column };
}
