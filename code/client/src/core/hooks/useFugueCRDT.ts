import { useMemo, useState } from 'react';
import { generateRandomId } from '../utils.ts';
import { getTagId } from '../utils.ts';

function useFugueCRDT() {
  const [characters, setCharacters] = useState<string[]>([]);
  const replicaId = useMemo(() => generateRandomId(), []);
  const [counter, setCounter] = useState(0);

  const createBetween = (a: string | undefined, b: string | undefined): string => {
    // A globally unique new string, in the form of a causal dot.
    const uniqueStr = `${replicaId}${counter}`;
    setCounter(prev => prev + 1);
    if (a !== undefined && b !== undefined) {
      if (!b.startsWith(a)) {
        // a is not a prefix of b.
        return a + uniqueStr + 'R';
      }
      // a is a strict prefix of b.
      const bWithL = b.slice(0, -1) + 'L';
      return bWithL + uniqueStr + 'R';
    }
    // Edge cases.
    if (b === undefined) {
      // Treat a (possibly undefined) as not a prefix of b.
      return (a ?? '') + uniqueStr + 'R';
    }
    // Treat a (undefined) as a strict prefix of b.
    const bWithL = b.slice(0, -1) + 'L';
    return bWithL + uniqueStr + 'R';
  };

  const getNeighbors = (cursor: number): [string | undefined, string | undefined] => {
    const left = characters[cursor - 1];
    const right = characters[cursor];
    return [left, right];
  };

  const insertLocal = (char: string, cursor: number): string => {
    const [left, right] = getNeighbors(cursor);
    return createBetween(left && getTagId(left), right && getTagId(right)) + char;
  };

  const deleteLocal = (cursor: number): string => {
    return characters[cursor - 1];
  };

  const insertRemote = (character: string): string[] => {
    const index = binarySearchIndex(getTagId(character));
    return [...characters.slice(0, index), character, ...characters.slice(index)];
  };

  const deleteRemote = (character: string): string[] => {
    return characters.filter(char => getTagId(char) !== getTagId(character));
  };

  const binarySearchIndex = (charId: string): number => {
    let left = 0;
    let right = characters.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (getTagId(characters[mid]) < charId) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
    // return characters.findIndex((char) => getTagId(char) === charId);
  };

  return {
    characters,
    setCharacters,
    operations: {
      insertLocal,
      deleteLocal,
      insertRemote,
      deleteRemote,
    },
  };
}

export default useFugueCRDT;
