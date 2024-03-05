import { useMemo, useState } from 'react';
import { generateRandomId } from '../utils.ts';

function useOptimizedFugue() {
  const [tree, setTree] = useState<string[]>([]);
  const replicaId = useMemo(() => generateRandomId(), []);

  // Public methods
  const insertLocal = (data: string, start: number, end: number) => {
    const [a, b] = getNeighbours(start, end);
    const items = data.split('');
    let currAnchor: string | undefined = undefined;
    const newElems: string[] = [];

    items.forEach(item => {
      const newPos = createBetween(currAnchor ?? a, b);
      newElems.push(newPos + item);
      currAnchor = item;
    });
    setTree(prev => sortTree([...prev, ...newElems]));

    return newElems;
  };

  const deleteLocal = (start: number, end: number): string[] => {
    const indexes = Array.from({ length: end - start + 1 }, (_, index) => end - index);
    const oldsElems: string[] = [];
    const newElems: string[] = [];

    indexes.forEach(index => {
      const [old, newElem] = deleteAt(index);
      if (!old || !newElem) return;
      oldsElems.push(old);
      newElems.push(newElem);
    });
    setTree(prev => {
      const newTree = prev.map((elem, idx) => (oldsElems.includes(elem) ? newElems[idx] : elem));
      return sortTree(newTree);
    });
    return oldsElems;
  };

  const insertRemote = (data: string[]) => {
    setTree(prev => sortTree([...prev, ...data]));
  };

  const deleteRemote = (data: string[]) => {};

  /**
   * Creates a new **positional string** for a element to be inserted between **a** and **b**
   * @param a - The left bound element
   * @param b - The right element
   */
  const createBetween = (a: string, b: string): string => {
    // Left child of b.
    if (b !== undefined) {
      if (a === undefined || isRightChild(b, a)) return leftNode(b, isLocal(b));
      return rightNode(a, isLocal(a));
    }
    // Root node
    if (a === undefined) return newWaypointNode(false);
    return rightNode(a, isLocal(a));
  };

  /**
   * Checks if **a** is the right child of **b**
   * @param a
   * @param b
   */
  const isRightChild = (a: string, b: string) => {
    return a.startsWith(rightNode(b, true));
  };

  /**
   * Creates a new **positional string** for a left child of **a**
   * @param a - The **positional string** of the parent
   * @param localParent - If the parent is local
   */
  const leftNode = (a: string, localParent: boolean) => {
    const newA = a.slice(0, -1) + 'L';
    return newA + newWaypointNode(localParent);
  };

  const isLocal = (a: string) => getLeafInfo(a).leafSender === replicaId;

  /**
   * Creates a new **positional string** for a right child of **a**
   * @param a - The **positional string** of the parent
   * @param localParent - If the parent is local
   */
  const rightNode = (a: string, localParent: boolean) => {
    const lastComma = a.lastIndexOf(',');
    const leafSender = a.slice(0, lastComma + 1);
    const lexSuccessor = lexicalSuccessor(getLeafInfo(a).leafIndex) + 'R';
    return leafSender + lexSuccessor + (localParent ? '' : newWaypointNode(false));
  };

  /**
   * Calculates the lexical successor of **n**
   * @param n
   * @return the lexical successor
   */
  const lexicalSuccessor = (n: number): number => {
    const d = n === 0 ? 1 : Math.floor(Math.log10(n)) + 1;
    return n === Math.pow(10, d) - Math.pow(9, d) - 1 ? (n + 1) * 10 : n + 1;
  };

  /**
   * Creates a new **positional string** for a new waypoint node
   * @param localParent
   */
  const newWaypointNode = (localParent: boolean): string => {
    const senderId = localParent ? '' : `-${replicaId},`;
    return senderId + '0R';
  };

  /**
   * Returns the neighbours of a **positional string**
   * @param start - The start index
   * @param end - The end index
   */
  const getNeighbours = (start: number, end: number) => {
    return [tree[start - 1], tree[end]].map(c => (c ? c.slice(0, -1) : c));
  };

  /**
   * Returns the leaf sender and the leaf index of a **positional string**
   * @param elem - The **positional string**
   * @return The leaf sender and the leaf index
   */
  const getLeafInfo = (elem: string) => {
    const lastHyphen = elem.lastIndexOf('-');
    const lastComma = elem.lastIndexOf(',');
    const indexValue = Number.parseInt(elem.slice(lastComma + 1, -1));

    const leafSender = elem.substring(lastHyphen === -1 ? 0 : lastHyphen + 1, lastComma);
    return { leafSender: leafSender, leafIndex: indexValue };
  };

  const getTagId = (elem: string): string => getLeafInfo(elem).leafSender;

  const getTagPosition = (elem: string): string => elem.slice(0, -1);

  const getTagValue = (elem: string): string => elem.charAt(elem.length - 1);

  const deleteAt = (idx: number): [string | undefined, string | undefined] => {
    const a = tree[idx];
    if (a === undefined) return [undefined, undefined];

    const backNeighbour = tree[idx - 1];
    if (backNeighbour.startsWith(a)) setTree(prev => prev.filter(elem => elem !== a));
    const replacement = getTagId(a) + '⊥';
    return [a, replacement];
  };

  const getState = (): string => {
    console.log(tree);
    const filtered = tree.filter(c => !c.endsWith('⊥'));
    const sorted = sortTree(filtered);
    console.log(sorted);
    return sorted.map(getTagValue).join('');
  };

  const sortTree = (newTree: string[]) => newTree.sort((a, b) => getTagPosition(a).localeCompare(getTagPosition(b)));

  return {
    tree,
    setTree,
    sortTree,
    operations: {
      insertLocal,
      deleteLocal,
      insertRemote,
      deleteRemote,
    },
    getState,
    getTagValue,
  };
}
export default useOptimizedFugue;
