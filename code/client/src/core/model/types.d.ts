type OperationData = {
  type: 'insert' | 'delete' | 'enter';
  char?: string;
  index: number;
};
