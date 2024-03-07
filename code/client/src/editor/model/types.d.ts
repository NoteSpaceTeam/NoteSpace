type TreeData<T> = {
  root: Node<T>;
  nodes: Map<string, Node<T>[]>;
};
