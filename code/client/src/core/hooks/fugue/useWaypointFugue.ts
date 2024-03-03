import { generateRandomId } from '../../utils.ts';
import { useMemo, useState } from 'react';

function useWaypointFugue() {
  const [elements, setElements] = useState<string[]>([]);
  const replicaId = useMemo(() => generateRandomId(), []);
  const [lastValueIndices, setLastValueIndices] = useState<number[]>([]);

  const createBetween = (a: string | undefined, b: string | undefined): string => {
    if (b !== undefined) {
      if (a === undefined) return b.slice(0, -1) + 'L' + newWaypointNode();

      const slice = a.slice(0, a.lastIndexOf(','));

      if (b.startsWith(slice)) return b.slice(0, -1) + 'L' + newWaypointNode();
    }
    // Right child of a.
    if (a === undefined) return newWaypointNode();

    const lastComma = a.lastIndexOf(',');
    const secondLastComma = a.lastIndexOf(',', lastComma - 1);
    const leafSender = a.slice(secondLastComma - replicaId.length, secondLastComma);
    if (leafSender === replicaId) {
      const leafCounter = Number.parseInt(a.slice(secondLastComma + 1, lastComma));
      const leafValueIndex = Number.parseInt(a.slice(lastComma + 1, -1));
      if (lastValueIndices[leafCounter] === leafValueIndex) {
        // Success; reuse a's leaf waypoint.
        const valueIndex = lexSuccessor(leafValueIndex);
        setLastValueIndices(prev => [...prev.slice(0, leafCounter), valueIndex, ...prev.slice(leafCounter + 1)]);

        return a.slice(0, lastComma + 1) + valueIndex.toString() + 'R';
      }
    }
    // Failure; cannot reuse a's leaf waypoint.
    return a + newWaypointNode();
  };

  const newWaypointNode = (): string => {
    const counter = lastValueIndices.length;
    setLastValueIndices(prev => [...prev, 0]);
    return `${replicaId},${counter},0R`;
  };

  const lexSuccessor = (n: number): number => {
    const d = n === 0 ? 1 : Math.floor(Math.log10(n)) + 1;
    return n === Math.pow(10, d) - Math.pow(9, d) - 1 ? (n + 1) * 10 : n + 1;
  };

  const getNeighbors = (cursor: number): [string | undefined, string | undefined] => {
    const tree = sortTree(elements);
    return [tree[cursor - 1], tree[cursor]];
  };

  const insertLocal = (character: string, cursor: number): string => {
    const [left, right] = getNeighbors(cursor).map(c => (c ? getTagId(c) : c));
    const char = createBetween(left, right) + character;
    const sortedElements = [...elements, char].sort((a, b) => getTagId(a).localeCompare(getTagId(b)));
    setElements(sortedElements);
    return char;
  };

  const deleteLocal = (cursor: number): string => {
    const char = elements[cursor - 1];
    // Deleting root node - do nothing
    if (!char) return '';
    const replacement = char.slice(0, -1) + '⊥';
    // replace the character with an '⊥' character
    setElements(prev => prev.map(c => (c === char ? replacement : c)));
    return char;
  };

  const insertRemote = (character: string) => {
    const sortedElements = [...elements, character].sort((a, b) => getTagId(a).localeCompare(getTagId(b)));
    setElements(sortedElements);
  };

  const deleteRemote = (character: string) => {
    const replacement = character.slice(0, -1) + '⊥';
    setElements(prev => prev.map(c => (c === character ? replacement : c)));
  };

  const getTagId = (inputString: string): string => {
    return inputString.substring(0, inputString.length - 1);
  };

  const sortTree = (arr: string[]): string[] => {
    const array = arr.filter(c => !c.endsWith('⊥'));
    return array.sort((a, b) => getTagId(a).localeCompare(getTagId(b)));
  };

  return {
    elements,
    setElements,
    operations: {
      insertLocal,
      deleteLocal,
      insertRemote,
      deleteRemote,
    },
    sortTree,
  };
}

export default useWaypointFugue;
