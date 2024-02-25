type Database = {
  getDocument: () => string;
  updateDocument: (content: string) => void;
  deleteDocument: () => void;
};

type Service = {
  getDocument: () => string;
  updateDocument: (content: string) => void;
  deleteDocument: () => void;
};
