import { range } from 'lodash';
import { InlineStyle } from '@notespace/shared/src/document/types/styles';

const BASE64CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const DEFAULT_REPLICA_ID_LENGTH = 10;

/**
 * Generates a random replica id
 * @returns the replica id
 */
export function generateReplicaId() {
  let id = '';
  const charsLength = BASE64CHARS.length;
  range(0, DEFAULT_REPLICA_ID_LENGTH).forEach(() => {
    const randomIndex = Math.floor(Math.random() * charsLength);
    id += BASE64CHARS[randomIndex];
  });
  return id;
}

/**
 * Creates a new insert node to be inserted in the tree
 * @param value
 * @param styles
 * @returns the insert node
 */
export const nodeInsert = (value: string, styles: InlineStyle[]) => ({ value, styles });
