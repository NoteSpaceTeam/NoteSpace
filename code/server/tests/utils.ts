import { FugueTree } from '@notespace/shared/crdt/FugueTree';

export function treeToString<T>(tree: FugueTree<T>): string {
  let result = '';
  for (const node of tree.traverse(tree.root)) {
    result += node.value;
  }
  return result;
}
