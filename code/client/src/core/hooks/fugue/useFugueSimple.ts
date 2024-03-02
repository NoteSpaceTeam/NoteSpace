import { useMemo, useState } from 'react';
import { generateRandomId } from '../../utils.ts';
import { getTagId } from '../../utils.ts';

function useFugueSimple() {
  const [elements, setElements] = useState<string[]>([]);
  const replicaId = useMemo(() => generateRandomId(), []);
  const [counter, setCounter] = useState(0);

  /**
   * Given two **positional strings**, creates a new positional string that is **lexicographically between them**.
   * @param a - The left **positional string**.
   * @param b - The right **positional string**.
   */
  const createBetween = (a: string | undefined, b: string | undefined): string => {
    // A globally unique new string, in the form of a causal dot.
    const uniqueStr = `${replicaId}${counter}`;
    setCounter(prev => prev + 1);

    if (a !== undefined && b !== undefined) {
      // Inserting between two characters.
      // 'a' is not ancestor of 'b' - insert as right child of 'a'.
      if (!b.startsWith(a)) return a + uniqueStr + 'R';
      // 'a' is ancestor of 'b' - insert as left child of 'b'.
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

  // Given a cursor position, returns the characters to the left and right of it, as two **positional strings**.
  const getNeighbors = (cursor: number): [string | undefined, string | undefined] => {
    return [elements[cursor - 1], elements[cursor]];
  };

  /** Given a char and the cursor position, inserts a new
    @param char - The character to insert.
    @param cursor - The position of the cursor.
    @returns The new character that was inserted, in the format positional-string + char
   */
  const insertLocal = (char: string, cursor: number): string => {
    const [left, right] = getNeighbors(cursor);
    const character = createBetween(left && getTagId(left), right && getTagId(right)) + char;
    setElements(prev => [...prev, character]);
    return character;
  };

  /**
   * Deletes the character at the given cursor position.
   * @param cursor - The position of the cursor.
   * @returns The character that was deleted.
   */
  const deleteLocal = (cursor: number): string => {
    const char = elements[cursor - 1];
    if (!char) return '';
    // replace the character at the cursor with an '⊥' character
    setElements(prev => prev.map((c, i) => (i === cursor - 1 ? c + '⊥' : c)));
    return char;
  };

  /**
   * Receives a remote insert operation and applies it to the local state.
   * @param character - The character to insert.
   * @returns The new state of the document.
   */
  const insertRemote = (character: string): string[] => {
    const index = binarySearchIndex(getTagId(character));
    return [...elements.slice(0, index), character, ...elements.slice(index)];
  };

  /**
   * Receives a remote delete operation and applies it to the local state.
   * @param character - The character to delete.
   * @returns The new state of the document.
   */
  const deleteRemote = (character: string): string[] => {
    return elements.map(c => (c === character ? c + '⊥' : c));
  };

  /**
   * Given a character id, returns the index of the character in the document.
   * @param charId
   * @param left
   * @param right
   * @returns The index of the character in the document.
   */
  const binarySearchIndex = (charId: string, left = 0, right = elements.length): number => {
    if (left >= right) return left;

    const mid = Math.floor((left + right) / 2);

    if (getTagId(elements[mid]) < charId) {
      return binarySearchIndex(charId, mid + 1, right);
    }
    return binarySearchIndex(charId, left, mid);
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
  };
}

export default useFugueSimple;
