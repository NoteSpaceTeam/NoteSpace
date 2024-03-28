export type Cursor = {
  line: number;
  column: number;
};

export type Selection = {
  start: Cursor;
  end: Cursor;
};
