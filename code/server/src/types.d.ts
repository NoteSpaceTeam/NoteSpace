type Database = {
  getDocument: () => string[];
  insertCharacter: (data: string[]) => void;
  deleteCharacter: (data: string[]) => void;
  deleteDocument: () => void;
};

type Service = {
  getDocument: () => string[];
  insertCharacter: (data: string[]) => void;
  deleteCharacter: (data: string[]) => void;
  deleteDocument: () => void;
};
