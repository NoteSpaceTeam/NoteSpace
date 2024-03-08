type TreeData<T> = {
  root: Node<T>;
  nodes: Record<string, Node<T>[]>;
};
