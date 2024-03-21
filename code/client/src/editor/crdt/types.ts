import { type Style } from '@notespace/shared/crdt/types';

export interface InsertNode<T> {
  value: T;
  styles: Style[];
}
