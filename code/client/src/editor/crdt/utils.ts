import { range } from 'lodash';
import type { Style } from '../../../../shared/types/styles.ts';
import type { InsertNode } from '@editor/crdt/types';

const BASE64CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const DEFAULT_REPLICA_ID_LENGTH = 10;

export function generateReplicaId() {
  let id = '';
  const charsLength = BASE64CHARS.length;
  range(0, DEFAULT_REPLICA_ID_LENGTH).forEach(() => {
    const randomIndex = Math.floor(Math.random() * charsLength);
    id += BASE64CHARS[randomIndex];
  });
  return id;
}

export function insertNode(value: string, styles: Style[]): InsertNode {
  return { value, styles };
}
