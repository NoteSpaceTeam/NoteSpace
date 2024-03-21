import { type InsertNode } from '@editor/crdt/types.ts';
import { type Style } from '@notespace/shared/crdt/types';

const BASE64CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const DEFAULT_REPLICA_ID_LENGTH = 10;

export function generateReplicaId() {
  let id = '';
  const charsLength = BASE64CHARS.length;
  for (let i = 0; i < DEFAULT_REPLICA_ID_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * charsLength);
    id += BASE64CHARS[randomIndex];
  }
  return id;
}

export function insertNode<T>(value: T, styles: Style[]): InsertNode<T> {
  return { value, styles };
}
