type Database = {
  getDocument: () => string[];
  insertCharacter: (character: string) => void;
  deleteCharacter: (character: string) => void;
  deleteDocument: () => void;
};

type Service = {
  getDocument: () => string[];
  insertCharacter: (character: string) => void;
  deleteCharacter: (character: string) => void;
  deleteDocument: () => void;
};
